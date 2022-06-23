import { useCallback, useMemo } from 'react'

import {
  PoolEntityType,
  TokenInfo,
  usePoolsListQuery,
} from './usePoolsListQuery'

export type PassThroughPoolsMatchForSwap = {
  in: PoolEntityType
  out: PoolEntityType
}

export type PoolMatchForSwap = {
  streamlinePoolAB?: PoolEntityType
  streamlinePoolBA?: PoolEntityType
  passThroughPools?: Array<PassThroughPoolsMatchForSwap>
}

type FindPoolForSwapArgs = {
  tokenA: TokenInfo
  tokenB: TokenInfo
  poolsList: Array<PoolEntityType>
}

/*
 * match pool if its assets contain provided token pair
 * and outline the token pair direction eg tokenA + tokenB
 * or tokenB + tokenA
 * */
function streamlinePoolMatch({
  pool,
  tokenA,
  tokenB,
}: {
  pool: PoolEntityType
  tokenA: TokenInfo
  tokenB: TokenInfo
}) {
  const {
    pool_assets: [poolTokenA, poolTokenB],
  } = pool
  const matchingAB =
    poolTokenA.symbol === tokenA.symbol && poolTokenB.symbol === tokenB.symbol

  const matchingBA =
    poolTokenA.symbol === tokenB.symbol && poolTokenB.symbol === tokenA.symbol

  return { matchingAB, matchingBA }
}

/* select pool by the given token pair */
function selectPoolByTokenPair(
  poolsList: Array<PoolEntityType>,
  tokenA: TokenInfo,
  tokenB: TokenInfo
) {
  return poolsList.find(({ pool_assets: [assetA, assetB] }) => {
    return tokenA.symbol === assetA.symbol && tokenB.symbol === assetB.symbol
  })
}

function validateIfPassThroughPoolMatchIsUnique(
  passThroughPools: Array<PassThroughPoolsMatchForSwap>,
  passThroughPoolMatch: PassThroughPoolsMatchForSwap
) {
  const hasPassThroughPoolMatch = passThroughPools.find((pool) => {
    return (
      pool.in.pool_id === passThroughPoolMatch.in.pool_id &&
      pool.out.pool_id === passThroughPoolMatch.out.pool_id
    )
  })

  return !hasPassThroughPoolMatch
}

/*
 * assuming theres always a pool with `baseToken` including either a `tokenA` or `tokenB` pair
 * */
export function findPoolForSwap({
  tokenA,
  tokenB,
  poolsList,
}: FindPoolForSwapArgs) {
  return poolsList.reduce(
    (result, pool) => {
      const matchingStreamlinePair = streamlinePoolMatch({
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

      const [poolAssetA, poolAssetB] = pool.pool_assets

      const matchingPassThroughPoolRequirements =
        poolAssetA.symbol !== tokenA.symbol &&
        [tokenA.symbol, tokenB.symbol].includes(poolAssetB.symbol)

      if (matchingPassThroughPoolRequirements) {
        let passThroughPoolIn: PoolEntityType
        let passThroughPoolOut: PoolEntityType

        const matchingPassThroughPoolInRequirement =
          poolAssetB.symbol === tokenA.symbol
        const matchingPassThroughPoolOutRequirement =
          poolAssetB.symbol === tokenB.symbol

        if (matchingPassThroughPoolInRequirement) {
          passThroughPoolIn = pool
          passThroughPoolOut = selectPoolByTokenPair(
            poolsList,
            poolAssetA,
            tokenB
          )
        } else if (matchingPassThroughPoolOutRequirement) {
          passThroughPoolIn = selectPoolByTokenPair(
            poolsList,
            poolAssetA,
            tokenA
          )
          passThroughPoolOut = pool
        }

        const passThroughPoolMatch = {
          in: passThroughPoolIn,
          out: passThroughPoolOut,
        }

        const shouldAddMatchingPassThroughPool =
          passThroughPoolIn &&
          passThroughPoolOut &&
          validateIfPassThroughPoolMatchIsUnique(
            result.passThroughPools,
            passThroughPoolMatch
          )

        if (shouldAddMatchingPassThroughPool) {
          result.passThroughPools.push(passThroughPoolMatch)
        }
      }

      return result
    },
    {
      streamlinePoolAB: null,
      streamlinePoolBA: null,
      passThroughPools: [],
    } as PoolMatchForSwap
  )
}

type GetMatchingPoolArgs = {
  tokenA: TokenInfo
  tokenB: TokenInfo
}

export const useGetQueryMatchingPoolForSwap = () => {
  const { data: poolsListResponse, isLoading } = usePoolsListQuery()

  const getMatchingPool = useCallback(
    ({ tokenA, tokenB }: GetMatchingPoolArgs) => {
      if (!poolsListResponse?.pools || !tokenA || !tokenB) return undefined

      return findPoolForSwap({
        tokenA,
        tokenB,
        poolsList: poolsListResponse.pools,
      })
    },
    [poolsListResponse]
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
