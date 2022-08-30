import {
  BASE_TOKEN_CRAB_POOL,
  BASE_TOKEN_DAO_POOL,
  CRAB_DAO_POOL,
  CRAB_TOKEN,
  DAO_TOKEN,
} from '../../../util/testutils'
import { selectEligiblePoolsForTokenToTokenSwap } from './selectEligiblePoolsForTokenToTokenSwap'

describe('selectEligiblePoolsForTokenToTokenSwap', () => {
  const poolsList = [CRAB_DAO_POOL, BASE_TOKEN_CRAB_POOL, BASE_TOKEN_DAO_POOL]

  it('selects token A to token B pool for swap', () => {
    const [[pool]] = selectEligiblePoolsForTokenToTokenSwap({
      tokenA: CRAB_TOKEN,
      tokenB: DAO_TOKEN,
      poolsList,
    })
    expect(pool).toBe(CRAB_DAO_POOL)
  })

  it('selects token B to token A pool for swap', () => {
    const [[pool]] = selectEligiblePoolsForTokenToTokenSwap({
      tokenA: DAO_TOKEN,
      tokenB: CRAB_TOKEN,
      poolsList,
    })
    expect(pool).toBe(CRAB_DAO_POOL)
  })

  it('selects pass through pools for swap', () => {
    const selectedPools = selectEligiblePoolsForTokenToTokenSwap({
      tokenA: CRAB_TOKEN,
      tokenB: DAO_TOKEN,
      poolsList,
    })

    const passThroughPool = selectedPools.find((pools) => pools.length > 1)
    expect(passThroughPool).toEqual([BASE_TOKEN_CRAB_POOL, BASE_TOKEN_DAO_POOL])
  })
})
