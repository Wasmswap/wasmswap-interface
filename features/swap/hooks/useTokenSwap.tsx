import {
  swapToken1ForToken2,
  swapToken2ForToken1,
  swapTokenForToken,
} from 'services/swap'
import { unsafelyGetTokenInfo, useBaseTokenInfo } from 'hooks/useTokenInfo'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { toast } from 'react-hot-toast'
import {
  TransactionStatus,
  transactionStatusState,
} from 'state/atoms/transactionAtoms'
import { walletState, WalletStatusType } from 'state/atoms/walletAtoms'
import { convertDenomToMicroDenom } from 'util/conversion'
import { slippageAtom, tokenSwapAtom } from '../swapAtoms'
import { useMutation, useQueryClient } from 'react-query'
import { Toast } from 'components/Toast'
import { IconWrapper } from 'components/IconWrapper'
import { Error } from 'icons/Error'
import { Button } from 'components/Button'
import { UpRightArrow } from 'icons/UpRightArrow'
import { Valid } from 'icons/Valid'

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

  const baseToken = useBaseTokenInfo()

  const queryClient = useQueryClient()

  return useMutation(
    'swapTokens',
    async () => {
      const tokenA = unsafelyGetTokenInfo(tokenASymbol)
      const tokenB = unsafelyGetTokenInfo(tokenBSymbol)

      if (status !== WalletStatusType.connected) {
        throw 'Please connect your wallet.'
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

      if (tokenASymbol === baseToken.symbol) {
        return await swapToken1ForToken2({
          nativeAmount: convertedTokenAmount,
          price: convertedPrice,
          slippage,
          senderAddress: address,
          swapAddress: tokenB.swap_address,
          client,
        })
      }

      if (tokenBSymbol === baseToken.symbol) {
        return await swapToken2ForToken1({
          tokenAmount: convertedTokenAmount,
          price: convertedPrice,
          slippage,
          senderAddress: address,
          tokenAddress: tokenA.token_address,
          tokenDenom: tokenA.denom,
          swapAddress: tokenA.swap_address,
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
        swapAddress: tokenA.swap_address,
        tokenNative: tokenA.native,
        tokenDenom: tokenA.denom,
        outputSwapAddress: tokenB.swap_address,
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

        queryClient.refetchQueries({ active: true })
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
            icon={<IconWrapper icon={<Error />} color="error" />}
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
