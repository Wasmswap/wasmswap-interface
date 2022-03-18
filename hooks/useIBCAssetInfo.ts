import { useCallback, useMemo } from 'react'

import {
  getCachedIBCAssetList,
  IBCAssetInfo,
  useIBCAssetList,
} from './useIbcAssetList'

export const unsafelyGetIBCAssetInfo = (
  assetSymbol: string,
  assetList = getCachedIBCAssetList()?.tokens
): IBCAssetInfo | undefined => assetList?.find((x) => x.symbol === assetSymbol)

export const useGetMultipleIBCAssetInfo = () => {
  const [assetList] = useIBCAssetList()
  return useCallback(
    function getMultipleIBCAssetInfo(assetSymbols: Array<string>) {
      return assetSymbols?.map((assetSymbol) =>
        unsafelyGetIBCAssetInfo(assetSymbol, assetList?.tokens)
      )
    },
    [assetList]
  )
}

export const useIBCAssetInfo = (assetSymbol: string) => {
  const getMultipleIBCAssetInfo = useGetMultipleIBCAssetInfo()
  return useMemo(
    () => getMultipleIBCAssetInfo([assetSymbol])?.[0],
    [assetSymbol, getMultipleIBCAssetInfo]
  )
}
