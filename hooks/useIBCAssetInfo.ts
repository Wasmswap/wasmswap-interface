import { useMemo } from 'react'
import {
  getCachedIBCAssetList,
  IBCAssetInfo,
  useIBCAssetList,
} from './useIbcAssetList'

export const getIBCAssetInfo = (
  assetSymbol: string,
  assetList = getCachedIBCAssetList()?.tokens
): IBCAssetInfo | undefined => assetList?.find((x) => x.symbol === assetSymbol)

export const useIBCAssetInfo = (assetSymbol: string) => {
  const [assetList] = useIBCAssetList()
  return useMemo(
    () => getIBCAssetInfo(assetSymbol, assetList?.tokens),
    [assetSymbol, assetList]
  )
}
