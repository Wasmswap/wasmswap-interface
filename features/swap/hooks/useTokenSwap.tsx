import { useTokenInfo } from 'hooks/useTokenInfo'
import {
  Button,
  ErrorIcon,
  IconWrapper,
  Toast,
  UpRightArrow,
  Valid,
} from 'junoblocks'
import { toast } from 'react-hot-toast'
import { useMutation } from 'react-query'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { directTokenSwap, passThroughTokenSwap } from 'services/swap'
import {
  TransactionStatus,
  transactionStatusState,
} from 'state/atoms/transactionAtoms'
import { walletState, WalletStatusType } from 'state/atoms/walletAtoms'
import { convertDenomToMicroDenom } from 'util/conversion'

import { useRefetchQueries } from '../../../hooks/useRefetchQueries'
import { useQueryMatchingPoolForSwap } from '../../../queries/useQueryMatchingPoolForSwap'
import { slippageAtom, tokenSwapAtom } from '../swapAtoms'

type UseTokenSwapArgs = {
  tokenASymbol: string
  tokenBSymbol: string
  /* token amount in denom */
  tokenAmount: number
  tokenToTokenPrice: number
}

export const useTokenSwap = ({
  tokenASymbol,
  tokenBSymbol,
  tokenAmount: providedTokenAmount,
  tokenToTokenPrice,
}: UseTokenSwapArgs) => {
  const { client, address, status } = useRecoilValue(walletState)
  const setTransactionState = useSetRecoilState(transactionStatusState)
  const slippage = useRecoilValue(slippageAtom)
  const setTokenSwap = useSetRecoilState(tokenSwapAtom)

  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)
  const [matchingPools] = useQueryMatchingPoolForSwap({ tokenA, tokenB })
  const refetchQueries = useRefetchQueries(['tokenBalance'])

  return useMutation(
    'swapTokens',
    async () => {
      if (status !== WalletStatusType.connected) {
        throw new Error('Please connect your wallet.')
      }

      setTransactionState(TransactionStatus.EXECUTING)

      const tokenAmount = convertDenomToMicroDenom(
        providedTokenAmount,
        tokenA.decimals
      )

      const price = convertDenomToMicroDenom(tokenToTokenPrice, tokenB.decimals)

      const {
        streamlinePoolAB,
        streamlinePoolBA,
        baseTokenAPool,
        baseTokenBPool,
      } = matchingPools

      if (streamlinePoolAB || streamlinePoolBA) {
        const swapDirection = streamlinePoolAB?.swap_address
          ? 'tokenAtoTokenB'
          : 'tokenBtoTokenA'
        const swapAddress =
          streamlinePoolAB?.swap_address ?? streamlinePoolBA?.swap_address

        return await directTokenSwap({
          tokenAmount,
          price,
          slippage,
          senderAddress: address,
          swapAddress,
          swapDirection,
          tokenA,
          client,
        })
      }

      return await passThroughTokenSwap({
        tokenAmount,
        price,
        slippage,
        senderAddress: address,
        tokenA,
        swapAddress: baseTokenAPool.swap_address,
        outputSwapAddress: baseTokenBPool.swap_address,
        client,
      })
    },
    {
      onSuccess() {
        toast.custom((t) => (
          <Toast
            icon={<IconWrapper icon={<Valid />} color="valid" />}
            title="Swap successful!"
            onClose={() => toast.dismiss(t.id)}
          />
        ))

        setTokenSwap(([tokenA, tokenB]) => [
          {
            ...tokenA,
            amount: 0,
          },
          tokenB,
        ])

        refetchQueries()
      },
      onError(e) {
        const errorMessage =
          String(e).length > 300
            ? `${String(e).substring(0, 150)} ... ${String(e).substring(
                String(e).length - 150
              )}`
            : String(e)

        toast.custom((t) => (
          <Toast
            icon={<ErrorIcon color="error" />}
            title="Oops swap error!"
            body={errorMessage}
            buttons={
              <Button
                as="a"
                variant="ghost"
                href={process.env.NEXT_PUBLIC_FEEDBACK_LINK}
                target="__blank"
                iconRight={<UpRightArrow />}
              >
                Provide feedback
              </Button>
            }
            onClose={() => toast.dismiss(t.id)}
          />
        ))
      },
      onSettled() {
        setTransactionState(TransactionStatus.IDLE)
      },
    }
  )
}
