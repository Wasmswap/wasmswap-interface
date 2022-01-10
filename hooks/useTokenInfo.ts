import { useMemo } from 'react'
import { useTokenList, getCachedTokenList, TokenInfo } from './useTokenList'

/* token selector functions */
export const getBaseToken = (
  tokenList = getCachedTokenList()
): TokenInfo | undefined => tokenList?.base_token

export const getTokenInfo = (
  tokenSymbol: string,
  tokensList = getCachedTokenList()?.tokens
): TokenInfo | undefined => tokensList?.find((x) => x.symbol === tokenSymbol)

export const getTokenInfoByPoolId = (
  poolId: string,
  tokensList = getCachedTokenList()?.tokens
): TokenInfo | undefined => tokensList?.find((x) => x.pool_id === poolId)
/* /token selector functions */

/* hook for base token info retrieval */
export const useBaseTokenInfo = () => {
  const [tokenList] = useTokenList()
  return useMemo(() => getBaseToken(tokenList), [tokenList])
}

/* hook for token info retrieval based on `tokenSymbol` */
export const useTokenInfo = (tokenSymbol: string) => {
  const [tokenList] = useTokenList()
  return useMemo(
    () => getTokenInfo(tokenSymbol, tokenList?.tokens),
    [tokenSymbol, tokenList]
  )
}

/* hook for token info retrieval based on `poolId` */
export const useTokenInfoByPoolId = (poolId: string) => {
  const [tokenList] = useTokenList()
  return useMemo(
    () => getTokenInfoByPoolId(poolId, tokenList?.tokens),
    [poolId, tokenList]
  )
}
