import { useMemo } from 'react'
import TokenList from '../public/token_list.json'

export type TokenInfo = {
  id: string
  pool_id: string
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

export const getTokenInfoByPoolId = (poolId: string): TokenInfo =>
  TokenList.tokens.find((x) => x.pool_id === poolId)

export const useTokenInfo = (tokenSymbol: string) => {
  return useMemo(() => getTokenInfo(tokenSymbol), [tokenSymbol])
}

export const useTokenInfoByPoolId = (poolId: string) => {
  return useMemo(() => getTokenInfoByPoolId(poolId), [poolId])
}

export const tokenList: Array<TokenInfo> = TokenList.tokens
