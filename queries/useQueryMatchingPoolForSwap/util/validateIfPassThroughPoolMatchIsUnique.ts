import { PassThroughPoolsForTokenToTokenSwap } from '../types'

export function validateIfPassThroughPoolMatchIsUnique(
  passThroughPools: Array<PassThroughPoolsForTokenToTokenSwap>,
  passThroughPoolMatch: PassThroughPoolsForTokenToTokenSwap
) {
  const hasPassThroughPoolMatch = passThroughPools.find((pool) => {
    return (
      pool.inputPool.pool_id === passThroughPoolMatch.inputPool.pool_id &&
      pool.outputPool.pool_id === passThroughPoolMatch.outputPool.pool_id
    )
  })

  return !hasPassThroughPoolMatch
}
