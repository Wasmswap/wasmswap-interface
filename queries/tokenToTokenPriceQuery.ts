import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'

import {
  getToken1ForToken2Price,
  getToken2ForToken1Price,
  getTokenForTokenPrice,
} from '../services/swap'
import {
  convertDenomToMicroDenom,
  convertMicroDenomToDenom,
} from '../util/conversion'
import { TokenInfo } from './usePoolsListQuery'
import { MatchingPoolsForTokenToTokenSwap } from './useQueryMatchingPoolForSwap'

type TokenToTokenPriceQueryArgs = {
  matchingPools: MatchingPoolsForTokenToTokenSwap
  tokenA: TokenInfo
  tokenB: TokenInfo
  amount: number
  client: CosmWasmClient
}

type TokenToTokenPriceQueryWithPoolsReturns = {
  price: number
} & MatchingPoolsForTokenToTokenSwap

export async function tokenToTokenPriceQueryWithPools({
  matchingPools,
  tokenA,
  tokenB,
  amount,
  client,
}: TokenToTokenPriceQueryArgs): Promise<TokenToTokenPriceQueryWithPoolsReturns> {
  if (tokenA.symbol === tokenB.symbol) {
    return { price: 1 }
  }

  const formatPrice = (price) =>
    convertMicroDenomToDenom(price, tokenB.decimals)

  const convertedTokenAmount = convertDenomToMicroDenom(amount, tokenA.decimals)

  const {
    poolForDirectTokenAToTokenBSwap,
    poolForDirectTokenBToTokenASwap,
    passThroughPools,
  } = matchingPools

  const pricingQueries: Array<Promise<TokenToTokenPriceQueryWithPoolsReturns>> =
    []

  if (poolForDirectTokenAToTokenBSwap) {
    pricingQueries.push(
      getToken1ForToken2Price({
        nativeAmount: convertedTokenAmount,
        swapAddress: poolForDirectTokenAToTokenBSwap.swap_address,
        client,
      }).then((price) => ({
        price: formatPrice(price),
        poolForDirectTokenAToTokenBSwap,
      }))
    )
  }

  if (poolForDirectTokenBToTokenASwap) {
    pricingQueries.push(
      getToken2ForToken1Price({
        tokenAmount: convertedTokenAmount,
        swapAddress: poolForDirectTokenBToTokenASwap.swap_address,
        client,
      }).then((price) => ({
        price: formatPrice(price),
        poolForDirectTokenBToTokenASwap,
      }))
    )
  }

  if (passThroughPools?.length) {
    passThroughPools.forEach((passThroughPool) => {
      pricingQueries.push(
        getTokenForTokenPrice({
          tokenAmount: convertedTokenAmount,
          tokenA,
          tokenB,
          inputPool: passThroughPool.inputPool,
          outputPool: passThroughPool.outputPool,
          client,
        }).then((price) => ({
          price: formatPrice(price),
          passThroughPools: [passThroughPool],
        }))
      )
    })
  }

  const prices: Array<TokenToTokenPriceQueryWithPoolsReturns> =
    await Promise.all(pricingQueries)

  /*
   * pick the best price among all the available swap routes.
   * the best price is the highest one.
   * */
  return prices.reduce((result, tokenPrice) => {
    return result?.price < tokenPrice.price ? tokenPrice : result
  }, prices[0])
}
