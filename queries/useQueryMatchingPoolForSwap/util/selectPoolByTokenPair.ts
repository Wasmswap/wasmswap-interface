/* select pool by the given token pair */
import { PoolEntityType, TokenInfo } from '../../usePoolsListQuery'

export function selectPoolByTokenPair(
  poolsList: Array<PoolEntityType>,
  tokenA: TokenInfo,
  tokenB: TokenInfo
) {
  return poolsList.find(({ pool_assets: [assetA, assetB] }) => {
    return tokenA.symbol === assetA.symbol && tokenB.symbol === assetB.symbol
  })
}
