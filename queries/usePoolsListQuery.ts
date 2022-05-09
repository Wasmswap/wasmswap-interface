import { useQuery } from 'react-query'

import { TokenInfo } from '../hooks/useTokenList'

export type PoolValue = {
  tokenAmount: number
  dollarValue: number
}

export type TokenInfoWithReward = TokenInfo & {
  rewards_address: string
}

export type PoolEntityType = {
  pool_id: string
  pool_assets: [TokenInfo, TokenInfo]
  swap_address: string
  staking_address: string
  rewards_tokens: Array<TokenInfoWithReward>
}

type PoolsListQueryResponse = {
  pools: Array<PoolEntityType>
  poolsById: Record<string, PoolEntityType>
  name: string
  logoURI: string
  keywords: Array<string>
  tags: Record<string, { name: string; description: string }>
}

export const usePoolsListQuery = (options?: Parameters<typeof useQuery>[1]) => {
  return useQuery<PoolsListQueryResponse>(
    '@pools-list',
    async () => {
      const response = await fetch(process.env.NEXT_PUBLIC_POOLS_LIST_URL)
      const tokenList = await response.json()

      return {
        ...tokenList,
        poolsById: tokenList.pools.reduce(
          (poolsById, pool) => ((poolsById[pool.pool_id] = pool), poolsById),
          {}
        ),
      }
    },
    Object.assign(
      {
        refetchOnMount: false,
      },
      options || {}
    )
  )
}
