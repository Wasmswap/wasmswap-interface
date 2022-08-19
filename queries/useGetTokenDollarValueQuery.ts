import { protectAgainstNaN } from 'junoblocks'

import { useCosmWasmClient } from '../hooks/useCosmWasmClient'
import { useTokenDollarValue } from '../hooks/useTokenDollarValue'
import { useBaseTokenInfo } from '../hooks/useTokenInfo'
import { tokenToTokenPriceQueryWithPools } from './tokenToTokenPriceQuery'
import { useGetQueryMatchingPoolForSwap } from './useQueryMatchingPoolForSwap'

/*
 * takes base token price, fetches the ratio of the token provided vs the base token
 * and calculates the dollar value of the provided token
 * */
export const useGetTokenDollarValueQuery = () => {
  const tokenA = useBaseTokenInfo()
  const client = useCosmWasmClient()
  const [tokenADollarPrice, fetchingDollarPrice] = useTokenDollarValue(
    tokenA?.symbol
  )

  const [getMatchingPoolForSwap, isLoadingPoolForSwapMatcher] =
    useGetQueryMatchingPoolForSwap()

  return [
    async function getTokenDollarValue({ tokenInfo, tokenAmountInDenom }) {
      if (!tokenAmountInDenom) return 0

      const priceForOneToken = (
        await tokenToTokenPriceQueryWithPools({
          matchingPools: getMatchingPoolForSwap({ tokenA, tokenB: tokenInfo }),
          tokenA,
          tokenB: tokenInfo,
          client,
          amount: 1,
        })
      )?.price

      return protectAgainstNaN(
        (tokenAmountInDenom / priceForOneToken) * tokenADollarPrice
      )
    },
    Boolean(
      tokenA && client && !fetchingDollarPrice && !isLoadingPoolForSwapMatcher
    ),
  ] as const
}
