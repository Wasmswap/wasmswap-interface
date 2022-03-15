import { useCallback, useMemo } from 'react'

import { getCachedTokenList, TokenInfo,useTokenList } from './useTokenList'

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

/* returns a selector for getting multiple tokens info at once */
export const useGetMultipleTokenInfo = () => {
  const [tokenList] = useTokenList()
  return useCallback(
    (tokenSymbols: Array<string>) =>
      tokenSymbols?.map((tokenSymbol) =>
        unsafelyGetTokenInfo(tokenSymbol, tokenList?.tokens)
      ),
    [tokenList]
  )
}

/* hook for token info retrieval based on multiple `tokenSymbol` */
export const useMultipleTokenInfo = (tokenSymbols: Array<string>) => {
  const getMultipleTokenInfo = useGetMultipleTokenInfo()
  return useMemo(
    () => getMultipleTokenInfo(tokenSymbols),
    [tokenSymbols, getMultipleTokenInfo]
  )
}

/* hook for token info retrieval based on `tokenSymbol` */
export const useTokenInfo = (tokenSymbol: string) => {
  return useMultipleTokenInfo(useMemo(() => [tokenSymbol], [tokenSymbol]))?.[0]
}

/* hook for token info retrieval based on `poolId` */
export const useTokenInfoByPoolIds = (poolIds: Array<string>) => {
  const [tokenList] = useTokenList()
  return useMemo(
    () =>
      poolIds?.map((poolId) =>
        unsafelyGetTokenInfoByPoolId(poolId, tokenList?.tokens)
      ),
    [poolIds, tokenList]
  )
}

/* hook for token info retrieval based on `poolId` */
export const useTokenInfoByPoolId = (poolId: string) => {
  return useTokenInfoByPoolIds(useMemo(() => [poolId], [poolId]))?.[0]
}

/* hook for base token info retrieval */
export const useBaseTokenInfo = () => {
  const [tokenList] = useTokenList()
  return useMemo(() => unsafelyGetBaseToken(tokenList), [tokenList])
}
