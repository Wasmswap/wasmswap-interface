import {
  MatchingPoolsForTokenToTokenSwap,
  SelectedPoolsForTokenToTokenSwap,
} from '../types'

/*
 * Given all the found pool pairs for swap,
 * verify if a pass through pool match wasn't added in the matching pools for swaps list.
 * */
export function validateIfPassThroughPoolMatchIsUnique(
  poolsForSwap: MatchingPoolsForTokenToTokenSwap,
  passThroughPoolMatch: SelectedPoolsForTokenToTokenSwap
) {
  const passThroughPoolMatchIds =
    getMatchingForTokenSwapPoolId(passThroughPoolMatch)
  const hasPassThroughPoolMatch = poolsForSwap.find((poolForSwap) => {
    const poolForSwapIds = getMatchingForTokenSwapPoolId(poolForSwap)
    return poolForSwapIds === passThroughPoolMatchIds
  })

  return !hasPassThroughPoolMatch
}

/*
 * Concatenate all the pool ids in the pool selection.
 *  */
function getMatchingForTokenSwapPoolId(
  poolForSwap: SelectedPoolsForTokenToTokenSwap
) {
  return poolForSwap.map((pool) => pool.pool_id).join(',')
}
