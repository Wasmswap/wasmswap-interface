/*
 * takes base token price, fetches the ratio of the token provided vs the base token
 * and calculates the dollar value of the provided token
 * */
import { useCosmWasmClient } from '../hooks/useCosmWasmClient'
import { useTokenDollarValue } from '../hooks/useTokenDollarValue'
import { useBaseTokenInfo } from '../hooks/useTokenInfo'
import { tokenToTokenPriceQuery } from './tokenToTokenPriceQuery'

export const useGetTokenDollarValueQuery = () => {
  const tokenA = useBaseTokenInfo()
  const client = useCosmWasmClient()
  const [tokenADollarPrice, fetchingDollarPrice] = useTokenDollarValue(
    tokenA?.symbol
  )

  return [
    async function getTokenDollarValue({ tokenInfo, tokenAmountInDenom }) {
      if (!tokenAmountInDenom) return 0

      const priceForOneToken = await tokenToTokenPriceQuery({
        baseToken: tokenA,
        fromTokenInfo: tokenA,
        toTokenInfo: tokenInfo,
        client,
        amount: 1,
      })

      return tokenAmountInDenom * (priceForOneToken * tokenADollarPrice)
    },
    Boolean(tokenA && client && !fetchingDollarPrice),
  ] as const
}
