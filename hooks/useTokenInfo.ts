import { useMemo } from 'react'
import { useTokenList, getCachedTokenList, TokenInfo } from './useTokenList'

/* token selector functions */
export const unsafelyGetBaseToken = (
  tokenList = getCachedTokenList()
): TokenInfo | undefined => tokenList?.base_token

export const unsafelyGetTokenInfo = (
  tokenSymbol: string,
  tokensList = getCachedTokenList()?.tokens
): TokenInfo | undefined => tokensList?.find((x) => x.symbol === tokenSymbol)

export const unsafelyGetTokenInfoByPoolId = (
  poolId: string,
  tokensList = getCachedTokenList()?.tokens
): TokenInfo | undefined => tokensList?.find((x) => x.pool_id === poolId)
/* /token selector functions */

/* hook for base token info retrieval */
export const useBaseTokenInfo = () => {
  const [tokenList] = useTokenList()
  return useMemo(() => unsafelyGetBaseToken(tokenList), [tokenList])
}

/* hook for token info retrieval based on `tokenSymbol` */
export const useTokenInfo = (tokenSymbol: string) => {
  const [tokenList] = useTokenList()
  return useMemo(
    () => unsafelyGetTokenInfo(tokenSymbol, tokenList?.tokens),
    [tokenSymbol, tokenList]
  )
}

/* hook for token info retrieval based on `poolId` */
export const useTokenInfoByPoolId = (poolId: string) => {
  const [tokenList] = useTokenList()
  return useMemo(
    () => unsafelyGetTokenInfoByPoolId(poolId, tokenList?.tokens),
    [poolId, tokenList]
  )
}
