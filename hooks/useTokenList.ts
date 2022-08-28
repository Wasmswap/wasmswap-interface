import { useQuery } from 'react-query'

import { TokenInfo, usePoolsListQuery } from '../queries/usePoolsListQuery'

export type TokenList = {
  base_token: TokenInfo
  tokens: Array<TokenInfo>
  tokensBySymbol: Map<string, TokenInfo>
}

export const useTokenList = () => {
  const { data: poolsListResponse } = usePoolsListQuery()

  /* generate token list off pool list and store it in cache */
  const { data } = useQuery<TokenList>(
    '@token-list',
    () => {
      const tokenMapBySymbol = new Map()
      /* serialize pool assets */
      poolsListResponse.pools.forEach(({ pool_assets }) => {
        pool_assets?.forEach((token) => {
          if (!tokenMapBySymbol.has(token.symbol)) {
            tokenMapBySymbol.set(token.symbol, token)
          }
        })
      })

      return {
        base_token: poolsListResponse.base_token,
        tokens: Array.from(tokenMapBySymbol.values()),
        tokensBySymbol: tokenMapBySymbol,
      }
    },
    {
      enabled: Boolean(poolsListResponse?.pools),
      refetchOnMount: false,
      onError(e) {
        console.error('Error generating token list:', e)
      },
    }
  )

  const isLoading = !poolsListResponse?.pools

  return [data, isLoading] as const
}
