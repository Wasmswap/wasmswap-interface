import { PoolEntityType, TokenInfo } from '../../usePoolsListQuery'
import { MatchingPoolsForTokenToTokenSwap } from '../types'
import { selectPoolByTokenPair } from './selectPoolByTokenPair'
import { validateIfPassThroughPoolMatchIsUnique } from './validateIfPassThroughPoolMatchIsUnique'

type SelectEligiblePoolsForTokenToTokenSwapArgs = {
  tokenA: TokenInfo
  tokenB: TokenInfo
  poolsList: Array<PoolEntityType>
}

/* find all the eligible direct and indirect swap pools */
export function selectEligiblePoolsForTokenToTokenSwap({
  tokenA,
  tokenB,
  poolsList,
}: SelectEligiblePoolsForTokenToTokenSwapArgs) {
  return poolsList.reduce((result, pool) => {
    const [poolAssetA, poolAssetB] = pool.pool_assets

    /*
     * validate if this pool can be used for
     * direct token a token b pool pair match
     * */
    const eligibleForDirectTokenAToTokenBSwap =
      poolAssetA.symbol === tokenA.symbol && poolAssetB.symbol === tokenB.symbol

    const eligibleForDirectTokenBToTokenASwap =
      poolAssetA.symbol === tokenB.symbol && poolAssetB.symbol === tokenA.symbol

    if (
      eligibleForDirectTokenAToTokenBSwap ||
      eligibleForDirectTokenBToTokenASwap
    ) {
      result.push([pool])
      return result
    }

    /*
     * validate if the pool can be used as a pass through
     * token a token b pair match
     * */
    const eligibleAsPassThroughPoolPair =
      poolAssetA.symbol !== tokenA.symbol &&
      [tokenA.symbol, tokenB.symbol].includes(poolAssetB.symbol)

    if (eligibleAsPassThroughPoolPair) {
      const isValidSwapInputPool = poolAssetB.symbol === tokenA.symbol
      const isValidSwapOutputPool = poolAssetB.symbol === tokenB.symbol

      const passThroughSwapInputPool = isValidSwapInputPool
        ? pool
        : selectPoolByTokenPair(poolsList, poolAssetA, tokenA)

      const passThroughSwapOutputPool = isValidSwapOutputPool
        ? pool
        : selectPoolByTokenPair(poolsList, poolAssetA, tokenB)

      const passThroughPoolPair: [PoolEntityType, PoolEntityType] = [
        passThroughSwapInputPool,
        passThroughSwapOutputPool,
      ]

      const hasEligiblePassThroughPoolPair =
        passThroughSwapInputPool &&
        passThroughSwapOutputPool &&
        validateIfPassThroughPoolMatchIsUnique(result, passThroughPoolPair)

      if (hasEligiblePassThroughPoolPair) {
        result.push(passThroughPoolPair)
      }
    }

    return result
  }, [] as MatchingPoolsForTokenToTokenSwap)
}
