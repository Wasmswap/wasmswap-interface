import { useTokenInfo } from 'hooks/useTokenInfo'
import {
  Button,
  ErrorIcon,
  formatSdkErrorMessage,
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
import { formatCompactNumber } from '../../../util/formatCompactNumber'
import { slippageAtom, tokenSwapAtom } from '../swapAtoms'
import { useTokenToTokenPrice } from './useTokenToTokenPrice'

type UseTokenSwapArgs = {
  tokenASymbol: string
  tokenBSymbol: string
  /* token amount in denom */
  tokenAmount: number
}

export const useTokenSwap = ({
  tokenASymbol,
  tokenBSymbol,
  tokenAmount: providedTokenAmount,
}: UseTokenSwapArgs) => {
  const { client, address, status } = useRecoilValue(walletState)
  const setTransactionState = useSetRecoilState(transactionStatusState)
  const slippage = useRecoilValue(slippageAtom)
  const setTokenSwap = useSetRecoilState(tokenSwapAtom)

  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)
  const refetchQueries = useRefetchQueries(['tokenBalance'])

  const [tokenToTokenPrice] = useTokenToTokenPrice({
    tokenASymbol,
    tokenBSymbol,
    tokenAmount: providedTokenAmount,
  })

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

      const price = convertDenomToMicroDenom(
        tokenToTokenPrice.price,
        tokenB.decimals
      )

      const {
        poolForDirectTokenAToTokenBSwap,
        poolForDirectTokenBToTokenASwap,
        passThroughPools,
      } = tokenToTokenPrice

      if (poolForDirectTokenAToTokenBSwap || poolForDirectTokenBToTokenASwap) {
        const swapDirection = poolForDirectTokenAToTokenBSwap?.swap_address
          ? 'tokenAtoTokenB'
          : 'tokenBtoTokenA'
        const swapAddress =
          poolForDirectTokenAToTokenBSwap?.swap_address ??
          poolForDirectTokenBToTokenASwap?.swap_address

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

      // Smoke test
      if (!passThroughPools?.length) {
        throw new Error(
          'Could not find a valid swap route. Try swapping to a different asset.'
        )
      }

      const [passThroughPool] = passThroughPools
      return await passThroughTokenSwap({
        tokenAmount,
        price,
        slippage,
        senderAddress: address,
        tokenA,
        inputPool: passThroughPool.inputPool,
        outputPool: passThroughPool.outputPool,
        client,
      })
    },
    {
      onSuccess() {
        toast.custom((t) => (
          <Toast
            icon={<IconWrapper icon={<Valid />} color="primary" />}
            title="Swap successful"
            body={`Turned ${formatCompactNumber(
              providedTokenAmount,
              'tokenAmount'
            )} ${tokenA.symbol} to ${formatCompactNumber(
              tokenToTokenPrice.price,
              'tokenAmount'
            )} ${tokenB.symbol}`}
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
        const errorMessage = formatSdkErrorMessage(e)

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
