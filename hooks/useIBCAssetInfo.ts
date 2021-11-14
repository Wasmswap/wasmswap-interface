import { useMemo } from 'react'
import IBCAssetList from '../public/ibc_assets.json'

export type IBCAssetInfo = {
  name: String,
  symbol: String,
  chain_id: String,
}

export const useIBCAssetInfo = (assetSymbol: string) => {
  return useMemo(
    () => IBCAssetList.tokens.find((x) => x.symbol === assetSymbol),
    [assetSymbol]
  )
}
