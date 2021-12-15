import { useQuery } from 'react-query'
import {
  getToken1ForToken2Price,
  getToken2ForToken1Price,
  getTokenForTokenPrice,
} from '../../../services/swap'
import { getBaseToken, getTokenInfo } from '../../../hooks/useTokenInfo'
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
      const base_token = getBaseToken()

      if (fromTokenInfo.symbol === base_token.symbol) {
        return formatPrice(
          await getToken1ForToken2Price({
            nativeAmount: tokenAmount * 1000000,
            swapAddress: toTokenInfo.swap_address,
            rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
          })
        )
      } else if (toTokenInfo.symbol === base_token.symbol) {
        return formatPrice(
          await getToken2ForToken1Price({
            tokenAmount: tokenAmount * 1000000,
            swapAddress: fromTokenInfo.swap_address,
            rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
          })
        )
      }

      return formatPrice(
        await getTokenForTokenPrice({
          tokenAmount: tokenAmount * 1000000,
          swapAddress: fromTokenInfo.swap_address,
          outputSwapAddress: toTokenInfo.swap_address,
          rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
        })
      )
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
