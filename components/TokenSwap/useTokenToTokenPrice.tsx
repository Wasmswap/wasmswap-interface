import { useQuery } from 'react-query'
import {
  getToken1ForToken2Price,
  getToken2ForToken1Price,
  getTokenForTokenPrice,
} from '../../services/swap'
import { getTokenInfo } from '../../hooks/useTokenInfo'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '../../util/constants'

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
        return (await getToken1ForToken2Price({
          nativeAmount: tokenAmount * 1000000,
          swapAddress: toTokenInfo.swap_address,
          rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
        })) / 1000000
      } else if (fromTokenInfo.token_address && !toTokenInfo.token_address) {
        return (await getToken2ForToken1Price({
          tokenAmount: tokenAmount * 1000000,
          swapAddress: fromTokenInfo.swap_address,
          rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
        })) / 1000000
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
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return [data, isLoading] as const
}
