import { useBaseTokenInfo, useGetMultipleTokenInfo } from 'hooks/useTokenInfo'
import { useQuery } from 'react-query'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from 'util/constants'

import { useCosmWasmClient } from '../../../hooks/useCosmWasmClient'
import { TokenInfo } from '../../../hooks/useTokenList'
import { tokenToTokenPriceQueryWithPools } from '../../../queries/tokenToTokenPriceQuery'
import { usePoolsListQuery } from '../../../queries/usePoolsListQuery'

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
  const baseToken = useBaseTokenInfo()
  const client = useCosmWasmClient()

  const { data: poolsListResponse } = usePoolsListQuery()
  const getMultipleTokenInfo = useGetMultipleTokenInfo()

  return useQuery({
    queryKey: [
      `tokenToTokenPrice/${tokenBSymbol}/${tokenASymbol}/${tokenAmount}`,
      tokenAmount,
    ],
    async queryFn() {
      const [tokenA, tokenB] = getMultipleTokenInfo([
        tokenASymbol,
        tokenBSymbol,
      ])

      return await tokenToTokenPriceQueryWithPools({
        poolsList: poolsListResponse.pools,
        baseToken,
        tokenA,
        tokenB,
        client,
        amount: tokenAmount,
      })
    },
    enabled: Boolean(
      enabled &&
        client &&
        baseToken &&
        poolsListResponse?.pools.length > 0 &&
        tokenBSymbol &&
        tokenASymbol &&
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
