import { useIBCAssetList } from 'hooks/useIbcAssetList'
import { useMultipleTokenBalance } from 'hooks/useTokenBalance'
import { useMemo } from 'react'

export const useGetSupportedAssetsBalancesOnChain = () => {
  const [ibcAssetList] = useIBCAssetList()
  const tokensList = useMemo(
    () => ibcAssetList?.tokens.map(({ symbol }) => symbol),
    [ibcAssetList]
  )

  const [tokenBalances, loadingBalances] = useMultipleTokenBalance(tokensList)

  const categorizedBalances = useMemo((): [
    typeof tokenBalances,
    typeof tokenBalances
  ] => {
    if (!tokenBalances?.length) {
      const fallbackTokensList =
        tokensList?.map((tokenSymbol) => ({
          balance: 0,
          tokenSymbol,
        })) ?? []
      return [[], fallbackTokensList]
    }

    const userTokens = []
    const otherTokens = []

    for (const token of tokenBalances) {
      if (token.balance > 0) {
        userTokens.push(token)
      } else {
        otherTokens.push(token)
      }
    }

    return [userTokens, otherTokens]
  }, [tokenBalances, tokensList])

  return [loadingBalances, categorizedBalances] as const
}
