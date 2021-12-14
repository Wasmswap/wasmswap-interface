import { useQuery } from 'react-query'
import {
  getNativeForTokenPrice,
  getTokenForNativePrice,
  getTokenForTokenPrice,
} from '../../../services/swap'
import { getTokenInfo } from '../../../hooks/useTokenInfo'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '../../../util/constants'

export const useTokenToTokenPrice = ({
  tokenASymbol,
  tokenBSymbol,
  tokenAmount,
}) => {
  const { data, isLoading } = useQuery(
    `tokenToTokenPrice/${tokenBSymbol}/${tokenASymbol}/${tokenAmount}`,
    async (): Promise<number | undefined> => {
      const fromTokenInfo = getTokenInfo(tokenASymbol)
      const toTokenInfo = getTokenInfo(tokenBSymbol)

      const formatPrice = (price) => price / 1000000

      if (fromTokenInfo.symbol === 'JUNO') {
        return formatPrice(
          await getNativeForTokenPrice({
            nativeAmount: tokenAmount * 1000000,
            swapAddress: toTokenInfo.swap_address,
            rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
          })
        )
      } else if (fromTokenInfo.token_address && !toTokenInfo.token_address) {
        return formatPrice(
          await getTokenForNativePrice({
            tokenAmount: tokenAmount * 1000000,
            swapAddress: fromTokenInfo.swap_address,
            rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
          })
        )
      }

      return await getTokenForTokenPrice({
        tokenAmount: tokenAmount * 1000000,
        swapAddress: fromTokenInfo.swap_address,
        outputSwapAddress: toTokenInfo.swap_address,
        rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
      })
    },
    {
      enabled: Boolean(tokenBSymbol && tokenASymbol && tokenAmount > 0),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return [data, isLoading] as const
}
