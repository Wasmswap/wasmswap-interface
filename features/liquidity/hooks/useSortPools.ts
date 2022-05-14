import { LiquidityInfoType } from 'hooks/usePoolLiquidity'
import { useBaseTokenInfo } from 'hooks/useTokenInfo'
import { TokenInfo } from 'hooks/useTokenList'
import { useMemo } from 'react'

export type SortParameters = 'liquidity' | 'rewards' | 'alphabetical'
export type SortDirections = 'asc' | 'desc'

type UseSortPoolsArgs = {
  liquidity?: Array<LiquidityInfoType> | undefined
  supportedTokens?: Array<TokenInfo>
  filter?: {
    tokenSymbol: string
  }
  sortBy?: {
    parameter: SortParameters
    direction: SortDirections
  }
}

type PoolInfo = {
  tokenB: TokenInfo
  tokenA: TokenInfo
  liquidityInfo: LiquidityInfoType
}

export const useSortPools = ({
  liquidity,
  supportedTokens,
  filter,
  sortBy,
}: UseSortPoolsArgs) => {
  const tokenA = useBaseTokenInfo()
  return useMemo((): readonly [Array<PoolInfo>, Array<PoolInfo>] => {
    const myPools = [] as Array<PoolInfo>
    const otherPools = [] as Array<PoolInfo>

    if (!liquidity?.length) {
      return [myPools, otherPools]
    }

    /* split up liquidity in my liquidity pools and other pools buckets */
    liquidity.forEach((liquidityInfo, index) => {
      const providedLiquidityAmount =
        liquidityInfo.myLiquidity.tokenAmount +
        liquidityInfo.myStakedLiquidity.tokenAmount
      const poolsBucket = providedLiquidityAmount > 0 ? myPools : otherPools

      poolsBucket.push({
        tokenA,
        tokenB: supportedTokens[index],
        liquidityInfo,
      })
    })

    /* sort and filter pools */
    return [
      sortPools(filterPools(myPools, filter), sortBy),
      sortPools(filterPools(otherPools, filter), sortBy),
    ] as const
  }, [liquidity, supportedTokens, filter, sortBy, tokenA])
}

function sortPools(
  pools: Array<PoolInfo>,
  sortBy?: UseSortPoolsArgs['sortBy']
) {
  if (!sortBy) return pools
  const result = pools.sort((poolA, poolB) => {
    /* sort by total liquidity */
    if (sortBy.parameter === 'liquidity') {
      const poolATotalLiquidity = poolA.liquidityInfo.totalLiquidity.dollarValue
      const poolBTotalLiquidity = poolB.liquidityInfo.totalLiquidity.dollarValue

      if (poolATotalLiquidity > poolBTotalLiquidity) {
        return 1
      } else if (poolATotalLiquidity < poolBTotalLiquidity) {
        return -1
      }
    }

    /* sort by tokenB names */
    if (sortBy.parameter === 'alphabetical') {
      if (poolA.tokenB.symbol > poolB.tokenB.symbol) {
        return 1
      } else if (poolA.tokenB.symbol < poolB.tokenB.symbol) {
        return -1
      }
    }

    return 0
  })

  if (sortBy.direction === 'desc') {
    return result.reverse()
  }

  return result
}

function filterPools(
  pools: Array<PoolInfo>,
  filter?: UseSortPoolsArgs['filter']
) {
  if (!filter || !filter.tokenSymbol) return pools
  return pools.filter(
    ({ tokenA, tokenB }) =>
      tokenA.symbol === filter.tokenSymbol ||
      tokenB.symbol === filter.tokenSymbol
  )
}
