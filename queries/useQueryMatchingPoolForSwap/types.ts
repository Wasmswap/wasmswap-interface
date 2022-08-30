import { PoolEntityType } from '../usePoolsListQuery'

/*
 * Selected pools for Swap.
 * Currently supports either one pool tokenA to tokenB or tokenB to tokenA.
 * Or pass through pools with an input and an output pools.
 *
 * Structuring as an array to make it more seamless to expand the number of pass thru pools
 * if/when needed.
 *  */
export type SelectedPoolsForTokenToTokenSwap =
  | [PoolEntityType]
  | [PoolEntityType, PoolEntityType]
export type MatchingPoolsForTokenToTokenSwap =
  Array<SelectedPoolsForTokenToTokenSwap>
