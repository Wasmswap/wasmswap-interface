import { useTokenInfo } from 'hooks/useTokenInfo'
import { usePersistance } from 'junoblocks'
import { useQueryMatchingPoolsForSwap } from 'queries/useQueryMatchingPoolForSwap'
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

  const [matchingPools] = useQueryMatchingPoolsForSwap({ tokenA, tokenB })

  return useQuery(
    `tokenToTokenPrice/${tokenBSymbol}/${tokenASymbol}/${tokenAmount}`,
    async () => {
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
    {
      enabled: Boolean(
        enabled &&
          client &&
          matchingPools &&
          tokenA &&
          tokenB &&
          tokenAmount > 0 &&
          tokenBSymbol !== tokenASymbol
      ),
      refetchOnMount: false,
      refetchInterval: refetchInBackground
        ? DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL
        : undefined,
      refetchIntervalInBackground: Boolean(refetchInBackground),
    }
  )
}

export const useTokenToTokenPrice = (args: UseTokenPairsPricesArgs) => {
  const { data: currentTokenPrice, isLoading } = useTokenToTokenPriceQuery(args)
  /* persist token price when querying a new one */
  const persistTokenPrice = usePersistance(
    isLoading ? undefined : currentTokenPrice
  )
  /* select token price */
  const tokenPrice = isLoading ? persistTokenPrice : currentTokenPrice
  return [tokenPrice || { price: 0 }, isLoading] as const
}
