import { useEffect, useState } from 'react'
import TokenList from '../public/token_list.json'

export interface TokenInfo {
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
  const [info, setInfo] = useState<TokenInfo>(
    TokenList.tokens.find((x) => x.symbol === tokenName)
  )

  useEffect(() => {
    setInfo(TokenList.tokens.find((x) => x.symbol === tokenName))
  }, [tokenName])

  return info
}
