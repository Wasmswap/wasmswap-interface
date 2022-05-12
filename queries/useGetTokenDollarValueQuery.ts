/*
 * takes base token price, fetches the ratio of the token provided vs the base token
 * and calculates the dollar value of the provided token
 * */
import { useCosmWasmClient } from '../hooks/useCosmWasmClient'
import { useTokenDollarValue } from '../hooks/useTokenDollarValue'
import { useBaseTokenInfo } from '../hooks/useTokenInfo'
import { tokenToTokenPriceQueryWithPools } from './tokenToTokenPriceQuery'
import { usePoolsListQuery } from './usePoolsListQuery'

export const useGetTokenDollarValueQuery = () => {
  const tokenA = useBaseTokenInfo()
  const client = useCosmWasmClient()
  const { data: poolListResponse } = usePoolsListQuery()
  const [tokenADollarPrice, fetchingDollarPrice] = useTokenDollarValue(
    tokenA?.symbol
  )

  return [
    async function getTokenDollarValue({ tokenInfo, tokenAmountInDenom }) {
      if (!tokenAmountInDenom) return 0

      const priceForOneToken = await tokenToTokenPriceQueryWithPools({
        baseToken: tokenA,
        tokenA,
        tokenB: tokenInfo,
        poolsList: poolListResponse.pools,
        client,
        amount: 1,
      })

      return tokenAmountInDenom * (priceForOneToken * tokenADollarPrice)
    },
    Boolean(
      tokenA && client && !fetchingDollarPrice && poolListResponse?.pools.length
    ),
  ] as const
}
