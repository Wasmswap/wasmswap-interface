import { useCallback, useMemo } from 'react'

import { useBaseTokenInfo } from '../hooks/useTokenInfo'
import { TokenInfo } from '../hooks/useTokenList'
import { PoolEntityType, usePoolsListQuery } from './usePoolsListQuery'

export type PoolMatchForSwap = {
  streamlinePoolAB?: PoolEntityType
  streamlinePoolBA?: PoolEntityType
  baseTokenAPool?: PoolEntityType
  baseTokenBPool?: PoolEntityType
}

type FindPoolForSwapArgs = {
  baseToken: TokenInfo
  tokenA: TokenInfo
  tokenB: TokenInfo
  poolsList: Array<PoolEntityType>
}

/*
 * assuming theres always a pool with `baseToken` including either a `tokenA` or `tokenB` pair
 * */
export function findPoolForSwap({
  baseToken,
  tokenA,
  tokenB,
  poolsList,
}: FindPoolForSwapArgs) {
  const isPoolMatchingTokens = ({
    pool: {
      pool_assets: [poolTokenA, poolTokenB],
    },
    tokenA,
    tokenB,
  }) => {
    const matchingAB =
      poolTokenA.symbol === tokenA.symbol && poolTokenB.symbol === tokenB.symbol

    const matchingBA =
      poolTokenA.symbol === tokenB.symbol && poolTokenB.symbol === tokenA.symbol

    return { matchingAB, matchingBA }
  }

  return poolsList.reduce((result, pool) => {
    if (
      result.streamlinePoolAB &&
      result.streamlinePoolBA &&
      result.baseTokenBPool &&
      result.baseTokenBPool
    ) {
      return result
    }

    const matchingStreamlinePair = isPoolMatchingTokens({
      pool,
      tokenA,
      tokenB,
    })

    if (matchingStreamlinePair.matchingAB) {
      result.streamlinePoolAB = pool
      return result
    }
    if (matchingStreamlinePair.matchingBA) {
      result.streamlinePoolBA = pool
      return result
    }

    const matchingStreamlineBaseAndTokenA = isPoolMatchingTokens({
      pool,
      tokenA: baseToken,
      tokenB: tokenA,
    })
    if (matchingStreamlineBaseAndTokenA.matchingAB) {
      result.baseTokenBPool = pool
      return result
    }

    const matchingStreamlineBaseAndTokenB = isPoolMatchingTokens({
      pool,
      tokenA: baseToken,
      tokenB,
    })
    if (matchingStreamlineBaseAndTokenB.matchingAB) {
      result.baseTokenBPool = pool
      return result
    }

    return result
  }, {} as PoolMatchForSwap)
}

type GetMatchingPoolArgs = {
  tokenA: TokenInfo
  tokenB: TokenInfo
}

export const useGetQueryMatchingPoolForSwap = () => {
  const baseToken = useBaseTokenInfo()
  const { data: poolsListResponse, isLoading } = usePoolsListQuery()

  const getMatchingPool = useCallback(
    ({ tokenA, tokenB }: GetMatchingPoolArgs) => {
      if (!poolsListResponse?.pools || !tokenA || !tokenB) return undefined

      return findPoolForSwap({
        baseToken,
        tokenA,
        tokenB,
        poolsList: poolsListResponse.pools,
      })
    },
    [baseToken, poolsListResponse]
  )

  return [getMatchingPool, isLoading] as const
}

export const useQueryMatchingPoolForSwap = ({
  tokenA,
  tokenB,
}: GetMatchingPoolArgs) => {
  const [getMatchingPool, isLoading] = useGetQueryMatchingPoolForSwap()

  return useMemo(
    () =>
      [
        getMatchingPool({
          tokenA,
          tokenB,
        }),
        isLoading,
      ] as const,
    [getMatchingPool, isLoading, tokenA, tokenB]
  )
}
