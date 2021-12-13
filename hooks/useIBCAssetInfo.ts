import { useMemo } from 'react'
import IBCAssetList from '../public/ibc_assets.json'

export type IBCAssetInfo = {
  id: string
  name: string
  symbol: string
  chain_id: string
  denom: string
  juno_denom: string
  juno_channel: string
  channel: string
  logoURI: string
}

export const getIBCAssetInfo = (assetSymbol: string): IBCAssetInfo =>
  IBCAssetList.tokens.find((x) => x.symbol === assetSymbol)

export const useIBCAssetInfo = (assetSymbol: string) => {
  return useMemo(() => getIBCAssetInfo(assetSymbol), [assetSymbol])
}

export const ibcAssetList = IBCAssetList.tokens as Array<IBCAssetInfo>
