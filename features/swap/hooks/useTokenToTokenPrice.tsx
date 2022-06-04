import { useTokenInfo } from 'hooks/useTokenInfo'
import { useQueryMatchingPoolForSwap } from 'queries/useQueryMatchingPoolForSwap'
import { useQuery } from 'react-query'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from 'util/constants'

import { useCosmWasmClient } from '../../../hooks/useCosmWasmClient'
import { tokenToTokenPriceQueryWithPools } from '../../../queries/tokenToTokenPriceQuery'
import { TokenInfo } from '../../../queries/usePoolsListQuery'

type UseTokenPairsPricesArgs = {
  tokenASymbol: TokenInfo['symbol']
  tokenBSymbol: TokenInfo['symbol']
  tokenAmount: number
  enabled?: boolean
  refetchInBackground?: boolean
}

export const useTokenToTokenPriceQuery = ({
  tokenAmount,
  tokenASymbol,
  tokenBSymbol,
  enabled = true,
  refetchInBackground,
}: UseTokenPairsPricesArgs) => {
  const client = useCosmWasmClient()

  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

  const [matchingPools] = useQueryMatchingPoolForSwap({ tokenA, tokenB })

  return useQuery({
    queryKey: [
      `tokenToTokenPrice/${tokenBSymbol}/${tokenASymbol}/${tokenAmount}`,
      tokenAmount,
    ],
    async queryFn() {
      if (tokenA && tokenB && matchingPools) {
        return await tokenToTokenPriceQueryWithPools({
          matchingPools,
          tokenA,
          tokenB,
          client,
          amount: tokenAmount,
        })
      }
    },
    enabled: Boolean(
      enabled &&
        client &&
        matchingPools &&
        tokenA &&
        tokenB &&
        tokenAmount > 0 &&
        tokenBSymbol !== tokenASymbol
    ),
    refetchOnMount: 'always' as const,
    refetchInterval: refetchInBackground
      ? DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL
      : undefined,
    refetchIntervalInBackground: Boolean(refetchInBackground),
  })
}

export const useTokenToTokenPrice = (args: UseTokenPairsPricesArgs) => {
  const { data, isLoading } = useTokenToTokenPriceQuery(args)
  return [data, isLoading] as const
}
