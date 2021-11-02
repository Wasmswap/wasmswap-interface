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
}

export const useTokenInfo = (tokenName: string) => {
  return useMemo(
    () => TokenList.tokens.find((x) => x.symbol === tokenName),
    [tokenName]
  )
}
