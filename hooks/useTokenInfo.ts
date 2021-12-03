import { useMemo } from 'react'
import TokenList from '../public/token_list.json'

export type TokenInfo = {
  chain_id: string
  token_address: string
  swap_address: string
  symbol: string
  name: string
  decimals: number
  logoURI: string
  tags: string[]
  denom: string
  native: boolean
}

export const getTokenInfo = (tokenSymbol: string): TokenInfo =>
  TokenList.tokens.find((x) => x.symbol === tokenSymbol)

export const useTokenInfo = (tokenSymbol: string) => {
  return useMemo(() => getTokenInfo(tokenSymbol), [tokenSymbol])
}
