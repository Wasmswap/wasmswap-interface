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
    const { poolForDirectTokenAToTokenBSwap } =
      selectEligiblePoolsForTokenToTokenSwap({
        tokenA: CRAB_TOKEN,
        tokenB: DAO_TOKEN,
        poolsList,
      })
    expect(poolForDirectTokenAToTokenBSwap).toBe(CRAB_DAO_POOL)
  })

  it('selects token B to token A pool for swap', () => {
    const { poolForDirectTokenBToTokenASwap } =
      selectEligiblePoolsForTokenToTokenSwap({
        tokenA: DAO_TOKEN,
        tokenB: CRAB_TOKEN,
        poolsList,
      })
    expect(poolForDirectTokenBToTokenASwap).toBe(CRAB_DAO_POOL)
  })

  it('selects pass through pools for swap', () => {
    const { passThroughPools } = selectEligiblePoolsForTokenToTokenSwap({
      tokenA: CRAB_TOKEN,
      tokenB: DAO_TOKEN,
      poolsList,
    })

    expect(passThroughPools).toEqual([
      { inputPool: BASE_TOKEN_CRAB_POOL, outputPool: BASE_TOKEN_DAO_POOL },
    ])
  })
})
