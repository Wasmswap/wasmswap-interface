import { PoolEntityType, TokenInfo } from '../../usePoolsListQuery'
import { MatchingPoolsForTokenToTokenSwap } from '../types'
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
  return poolsList.reduce(
    (result, pool) => {
      const [poolAssetA, poolAssetB] = pool.pool_assets

      /*
       * validate if this pool can be used for
       * direct token a token b pool pair match
       * */
      const eligibleForDirectTokenAToTokenBSwap =
        poolAssetA.symbol === tokenA.symbol &&
        poolAssetB.symbol === tokenB.symbol

      const eligibleForDirectTokenBToTokenASwap =
        poolAssetA.symbol === tokenB.symbol &&
        poolAssetB.symbol === tokenA.symbol

      if (eligibleForDirectTokenAToTokenBSwap) {
        result.poolForDirectTokenAToTokenBSwap = pool
        return result
      }

      if (eligibleForDirectTokenBToTokenASwap) {
        result.poolForDirectTokenBToTokenASwap = pool
        return result
      }

      /*
       * validate if the pool can be used as a pass through
       * token a token b pair match
       * */
      const eligibleAsPassThroughInputPool =
        tokenA.symbol === poolAssetA.symbol ||
        tokenA.symbol === poolAssetB.symbol

      if (eligibleAsPassThroughInputPool) {
        const intermediaryToken =
          tokenA.symbol === poolAssetA.symbol ? poolAssetB : poolAssetA

        const intermediaryTokenPositionInputPool =
          intermediaryToken.denom === poolAssetA.denom ? 'a' : 'b'

        const passThroughSwapOutputPool = poolsList.find(
          ({ pool_assets: [assetA, assetB] }) => {
            const intermediaryTokenPositionOutputPool =
              intermediaryToken.denom === assetA.denom ? 'a' : 'b'

            const intermediaryTokenInSamePosition =
              intermediaryTokenPositionInputPool ==
              intermediaryTokenPositionOutputPool
            return (
              ((intermediaryToken.symbol === assetA.symbol &&
                tokenB.symbol === assetB.symbol) ||
                (tokenB.symbol === assetA.symbol &&
                  intermediaryToken.symbol === assetB.symbol)) &&
              intermediaryTokenInSamePosition
            )
          }
        )

        const passThroughPoolPair = {
          inputPool: pool,
          outputPool: passThroughSwapOutputPool,
        }

        const hasEligiblePassThroughPoolPair =
          passThroughSwapOutputPool &&
          validateIfPassThroughPoolMatchIsUnique(
            result.passThroughPools,
            passThroughPoolPair
          )

        if (hasEligiblePassThroughPoolPair) {
          result.passThroughPools.push(passThroughPoolPair)
        }
      }

      return result
    },
    {
      poolForDirectTokenAToTokenBSwap: null,
      poolForDirectTokenBToTokenASwap: null,
      passThroughPools: [],
    } as MatchingPoolsForTokenToTokenSwap
  )
}
