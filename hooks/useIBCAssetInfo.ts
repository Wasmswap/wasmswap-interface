import { useMemo } from 'react'
import IBCAssetList from '../public/ibc_assets.json'

export type IBCAssetInfo = {
  name: string
  symbol: string
  chain_id: string
  denom: string
  juno_denom: string
  juno_channel: string
  channel: string
}

export const useIBCAssetInfo = (assetSymbol: string): IBCAssetInfo => {
  return useMemo(
    () => IBCAssetList.tokens.find((x) => x.symbol === assetSymbol),
    [assetSymbol]
  )
}
