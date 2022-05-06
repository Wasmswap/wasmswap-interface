import { useQuery } from 'react-query'

import { TokenInfo } from '../hooks/useTokenList'

export type PoolEntityType = {
  pool_id: string
  pool_assets: [TokenInfo, TokenInfo]
  swap_address: string
  staking_address: string
  rewards_tokens: Array<
    TokenInfo & {
      rewards_address: string
    }
  >
}

type PoolsListQueryResponse = {
  pools: Array<PoolEntityType>
  name: string
  logoURI: string
  keywords: Array<string>
  tags: Record<string, { name: string; description: string }>
}

export const usePoolsListQuery = (options: Parameters<typeof useQuery>[1]) => {
  return useQuery<PoolsListQueryResponse>(
    '@pools-list',
    async () => {
      const response = await fetch(process.env.NEXT_PUBLIC_POOLS_LIST_URL)
      return response.json()
    },
    {
      refetchOnMount: false,
      ...options,
    }
  )
}
