import { toast } from 'react-toastify'
import {
  swapToken1ForToken2,
  swapToken2ForToken1,
  swapTokenForToken,
} from '../../../services/swap'
import { getBaseToken, getTokenInfo } from '../../../hooks/useTokenInfo'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  TransactionStatus,
  transactionStatusState,
} from '../../../state/atoms/transactionAtoms'
import { walletState, WalletStatusType } from '../../../state/atoms/walletAtoms'
import { convertDenomToMicroDenom } from 'util/conversion'
import { slippageAtom, tokenSwapAtom } from '../swapAtoms'
import { useMutation, useQueryClient } from 'react-query'

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

  const queryClient = useQueryClient()

  return useMutation(
    'swapTokens',
    async () => {
      const tokenA = getTokenInfo(tokenASymbol)
      const tokenB = getTokenInfo(tokenBSymbol)
      const baseToken = getBaseToken()

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
        toast.success('🎉 Swap Successful', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })

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
        console.log(e)
        let msg =
          String(e).length > 300
            ? `${String(e).substring(0, 150)} ... ${String(e).substring(
                String(e).length - 150
              )}`
            : e
        toast.error(`Swap error: ${msg}`, {
          position: 'top-center',
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      },
      onSettled() {
        setTransactionState(TransactionStatus.IDLE)
      },
    }
  )
}
