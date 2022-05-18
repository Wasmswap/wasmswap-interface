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
import {
  swapToken1ForToken2,
  swapToken2ForToken1,
  swapTokenForToken,
} from 'services/swap'
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
  tokenAmount: number
  tokenToTokenPrice: number
}

export const useTokenSwap = ({
  tokenASymbol,
  tokenBSymbol,
  tokenAmount,
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

      const convertedTokenAmount = convertDenomToMicroDenom(
        tokenAmount,
        tokenA.decimals
      )

      const convertedPrice = convertDenomToMicroDenom(
        tokenToTokenPrice,
        tokenB.decimals
      )

      const {
        streamlinePoolAB,
        streamlinePoolBA,
        baseTokenAPool,
        baseTokenBPool,
      } = matchingPools

      if (streamlinePoolAB) {
        return await swapToken1ForToken2({
          nativeAmount: convertedTokenAmount,
          price: convertedPrice,
          slippage,
          senderAddress: address,
          swapAddress: streamlinePoolAB.swap_address,
          tokenDenom: tokenA.denom,
          client,
        })
      }

      if (streamlinePoolBA) {
        return await swapToken2ForToken1({
          tokenAmount: convertedTokenAmount,
          price: convertedPrice,
          slippage,
          senderAddress: address,
          tokenAddress: tokenA.token_address,
          tokenDenom: tokenA.denom,
          swapAddress: streamlinePoolBA.swap_address,
          token2_native: tokenA.native,
          client,
        })
      }

      return await swapTokenForToken({
        tokenAmount: convertedTokenAmount,
        price: convertedPrice,
        slippage,
        senderAddress: address,
        tokenAddress: tokenA.token_address,
        swapAddress: baseTokenAPool.swap_address,
        tokenNative: tokenA.native,
        tokenDenom: tokenA.denom,
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
