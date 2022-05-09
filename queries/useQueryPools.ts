import { useMemo } from 'react'
import { useQueries } from 'react-query'
import { useRecoilValue } from 'recoil'

import { useGetPoolTokensDollarValue } from '../features/liquidity'
import { useCosmWasmClient } from '../hooks/useCosmWasmClient'
import { walletState } from '../state/atoms/walletAtoms'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '../util/constants'
import { convertMicroDenomToDenom } from '../util/conversion'
import { queryMyLiquidity } from './queryMyLiquidity'
import { queryRewardsAnnualYieldRate } from './queryRewardsAnnualYieldRate'
import { queryStakedLiquidity } from './queryStakedLiquidity'
import { querySwapInfo } from './querySwapInfo'
import { useGetTokenDollarValueQuery } from './useGetTokenDollarValueQuery'
import { PoolEntityType, usePoolsListQuery } from './usePoolsListQuery'

export type ReserveType = [number, number]

export type PoolTokenValue = {
  tokenAmount: number
  dollarValue: number
}

export type PoolState = {
  total: PoolTokenValue
  provided: PoolTokenValue
}

export type PoolLiquidityState = {
  fluid: PoolState
  staked: PoolState

  providedTotal: PoolTokenValue

  reserves: {
    total: ReserveType
    provided: ReserveType
    totalStaked: ReserveType
    providedStaked: ReserveType
    totalProvided: ReserveType
  }

  rewards: {
    annualYieldPercentageReturn: number
  }
}

export type PoolEntityTypeWithLiquidity = PoolEntityType & {
  liquidity: PoolLiquidityState
}

type QueryMultiplePoolsArgs = {
  pools: Array<PoolEntityType>
  refetchInBackground?: boolean
}

export const useQueryMultiplePoolsLiquidity = ({
  pools,
  refetchInBackground = false,
}: QueryMultiplePoolsArgs) => {
  const [getTokenDollarValue, enabledGetTokenDollarValue] =
    useGetTokenDollarValueQuery()
  const [getPoolTokensDollarValue, enabledGetPoolTokensDollarValue] =
    useGetPoolTokensDollarValue()

  const { address, client: signingClient } = useRecoilValue(walletState)
  const client = useCosmWasmClient()

  const context = {
    client,
    signingClient,
    getTokenDollarValue,
    getPoolTokensDollarValue,
  }

  async function queryPoolLiquidity(
    pool: PoolEntityType
  ): Promise<PoolEntityTypeWithLiquidity> {
    const [tokenA] = pool.pool_assets

    const swap = await querySwapInfo({
      context,
      swap_address: pool.swap_address,
    })

    const { totalReserve, providedLiquidityInMicroDenom, providedReserve } =
      await queryMyLiquidity({
        context,
        swap,
        address,
      })

    const {
      providedStakedAmountInMicroDenom,
      totalStakedAmountInMicroDenom,
      totalStakedReserve,
      providedStakedReserve,
    } = await queryStakedLiquidity({
      context,
      address,
      stakingAddress: pool.staking_address,
      totalReserve,
      swap,
    })

    const [totalLiquidity, providedLiquidity, totalStaked, providedStaked] =
      await Promise.all([
        /* fetch total liquidity dollar value */
        getTokenDollarValue({
          tokenInfo: tokenA,
          tokenAmountInDenom: convertMicroDenomToDenom(
            totalReserve[0],
            tokenA.decimals
          ),
        }).then((dollarValue) => ({
          tokenAmount: swap.lp_token_supply,
          dollarValue: dollarValue * 2,
        })),
        /* fetch provided liquidity dollar value */
        getTokenDollarValue({
          tokenInfo: tokenA,
          tokenAmountInDenom: convertMicroDenomToDenom(
            providedReserve[0],
            tokenA.decimals
          ),
        }).then((dollarValue) => ({
          tokenAmount: providedLiquidityInMicroDenom,
          dollarValue: dollarValue * 2,
        })),
        /* fetch total staked liquidity dollar value */
        getTokenDollarValue({
          tokenInfo: tokenA,
          tokenAmountInDenom: convertMicroDenomToDenom(
            totalStakedAmountInMicroDenom,
            tokenA.decimals
          ),
        }).then((dollarValue) => ({
          tokenAmount: providedLiquidityInMicroDenom,
          dollarValue: dollarValue * 2,
        })),
        /* fetch provided liquidity dollar value */
        getTokenDollarValue({
          tokenInfo: tokenA,
          tokenAmountInDenom: convertMicroDenomToDenom(
            providedStakedAmountInMicroDenom,
            tokenA.decimals
          ),
        }).then((dollarValue) => ({
          tokenAmount: providedStakedAmountInMicroDenom,
          dollarValue: dollarValue * 2,
        })),
      ])

    let annualYieldPercentageReturn = 0

    const shouldQueryRewardsContracts = pool.rewards_tokens?.length > 0
    if (shouldQueryRewardsContracts) {
      annualYieldPercentageReturn = await queryRewardsAnnualYieldRate({
        swapAddress: pool.swap_address,
        rewardsTokens: pool.rewards_tokens,
        totalStakedDollarValue: totalStaked.dollarValue,
        context,
      })
    }

    const liquidity = {
      fluid: {
        total: totalLiquidity,
        provided: providedLiquidity,
      },
      staked: {
        total: totalStaked,
        provided: providedStaked,
      },
      providedTotal: {
        tokenAmount: providedLiquidity.tokenAmount + providedStaked.tokenAmount,
        dollarValue: providedLiquidity.dollarValue + providedStaked.dollarValue,
      },
      reserves: {
        total: totalReserve,
        provided: providedReserve,
        totalStaked: totalStakedReserve,
        providedStaked: providedStakedReserve,
        totalProvided: [
          providedReserve[0] + providedStakedReserve[0],
          providedReserve[1] + providedStakedReserve[1],
        ] as ReserveType,
      },
      rewards: {
        annualYieldPercentageReturn,
      },
    }

    return {
      ...pool,
      liquidity,
    }
  }

  return useQueries(
    (pools ?? []).map((pool) => ({
      queryKey: ['@pool-liquidity', pool.pool_id, address],
      enabled: Boolean(
        enabledGetTokenDollarValue && enabledGetPoolTokensDollarValue
      ),

      refetchOnMount: false as const,
      refetchInterval: refetchInBackground
        ? DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL
        : undefined,
      refetchIntervalInBackground: refetchInBackground,

      async queryFn() {
        return await queryPoolLiquidity(pool)
      },
    }))
  )
}

export const useQueryPoolLiquidity = ({ poolId }) => {
  const { data: poolsList } = usePoolsListQuery()

  const poolToFetch = useMemo(() => {
    const pool = poolsList?.pools.find((pool) => pool.pool_id === poolId)
    return pool ? [pool] : []
  }, [poolsList, poolId])

  const [liquidity, isLoading] = useQueryMultiplePoolsLiquidity({
    pools: poolToFetch,
    refetchInBackground: true,
  })

  return [liquidity?.[0], isLoading] as const
}
