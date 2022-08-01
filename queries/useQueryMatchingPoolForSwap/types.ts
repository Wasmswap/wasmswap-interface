import { PoolEntityType } from '../usePoolsListQuery'

export type PassThroughPoolsForTokenToTokenSwap = {
  inputPool: PoolEntityType
  outputPool: PoolEntityType
}

export type MatchingPoolsForTokenToTokenSwap = {
  poolForDirectTokenAToTokenBSwap?: PoolEntityType
  poolForDirectTokenBToTokenASwap?: PoolEntityType
  passThroughPools?: Array<PassThroughPoolsForTokenToTokenSwap>
}
