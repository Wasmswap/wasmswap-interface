import { useQuery } from 'react-query'

import { usePoolsListQuery } from '../queries/usePoolsListQuery'
import { getSwapInfo, InfoResponse } from '../services/swap'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '../util/constants'
import { useCosmWasmClient } from './useCosmWasmClient'

export type SwapInfo = Pick<
  InfoResponse,
  'token1_denom' | 'token2_denom' | 'lp_token_address'
> & {
  swap_address: string
  lp_token_supply: number
  token1_reserve: number
  token2_reserve: number
  lp_fee_percent?: number
  protocol_fee_percent?: number
}

type UseMultipleSwapInfoArgs = {
  poolId?: string
  refetchInBackground?: boolean
}

export const useSwapInfo = ({
  poolId,
  refetchInBackground,
}: UseMultipleSwapInfoArgs) => {
  const { data: poolsListResponse } = usePoolsListQuery()
  const client = useCosmWasmClient()

  const { data, isLoading } = useQuery<SwapInfo>(
    `swapInfo/${poolId}`,
    async () => {
      const pool = poolsListResponse.poolsById[poolId]
      const swap = await getSwapInfo(pool.swap_address, client)

      return {
        ...swap,
        swap_address: pool.swap_address,
        token1_reserve: Number(swap.token1_reserve),
        token2_reserve: Number(swap.token2_reserve),
        lp_token_supply: Number(swap.lp_token_supply),
        lp_fee_percent: swap.lp_fee_percent
          ? Number(swap.lp_fee_percent)
          : undefined,
        protocol_fee_percent: swap.protocol_fee_percent
          ? Number(swap.protocol_fee_percent)
          : undefined,
      }
    },
    {
      enabled: Boolean(poolsListResponse?.pools.length && client && poolId),
      refetchOnMount: false,
      refetchInterval: refetchInBackground
        ? DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL
        : undefined,
      refetchIntervalInBackground: refetchInBackground,
    }
  )

  return [data, isLoading] as const
}
