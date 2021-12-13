import { useQuery } from 'react-query'
import {
  getNativeForTokenPrice,
  getTokenForNativePrice,
  getTokenForTokenPrice,
} from '../../services/swap'
import { getTokenInfo } from '../../hooks/useTokenInfo'

export const useTokenToTokenPrice = ({
  tokenBSymbol,
  tokenASymbol,
  tokenAmount,
}) => {
  const { data, isLoading } = useQuery(
    `tokenToTokenPrice/${tokenBSymbol}/${tokenASymbol}/${tokenAmount}`,
    async (): Promise<number | undefined> => {
      const fromTokenInfo = getTokenInfo(tokenASymbol)
      const toTokenInfo = getTokenInfo(tokenBSymbol)

      if (fromTokenInfo.symbol === 'JUNO') {
        return await getNativeForTokenPrice({
          nativeAmount: tokenAmount * 1000000,
          swapAddress: toTokenInfo.swap_address,
          rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
        })
      } else if (fromTokenInfo.token_address && !toTokenInfo.token_address) {
        return await getTokenForNativePrice({
          tokenAmount: tokenAmount * 1000000,
          swapAddress: fromTokenInfo.swap_address,
          rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
        })
      }

      return await getTokenForTokenPrice({
        tokenAmount: tokenAmount * 1000000,
        swapAddress: fromTokenInfo.swap_address,
        outputSwapAddress: toTokenInfo.swap_address,
        rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
      })
    },
    {
      enabled: Boolean(tokenBSymbol && tokenAmount && tokenAmount > 0),
    }
  )

  return [data, isLoading] as const
}
