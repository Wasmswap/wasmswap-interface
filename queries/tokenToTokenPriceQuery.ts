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
import {
  MatchingPoolsForTokenToTokenSwap,
  SelectedPoolsForTokenToTokenSwap,
} from './useQueryMatchingPoolForSwap'

type TokenToTokenPriceQueryArgs = {
  matchingPools: MatchingPoolsForTokenToTokenSwap
  tokenA: TokenInfo
  tokenB: TokenInfo
  amount: number
  client: CosmWasmClient
}

type TokenToTokenPriceQueryWithPoolsReturns = {
  price: number
  poolsForTokenSwap?: SelectedPoolsForTokenToTokenSwap
}

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

  const prices: Array<TokenToTokenPriceQueryWithPoolsReturns> =
    await Promise.all(
      matchingPools.map((poolsForTokenSwap) => {
        const isDirectTokenTokenSwapPool = poolsForTokenSwap.length === 1
        if (isDirectTokenTokenSwapPool) {
          const [pool] = poolsForTokenSwap
          const isTokenAToTokenBPool =
            pool.pool_assets[0].symbol === tokenA.symbol
          const isTokenBToTokenAPool =
            pool.pool_assets[0].symbol === tokenB.symbol

          if (isTokenAToTokenBPool) {
            return getToken1ForToken2Price({
              nativeAmount: convertedTokenAmount,
              swapAddress: pool.swap_address,
              client,
            }).then((price) => ({
              price: formatPrice(price),
              poolsForTokenSwap,
            }))
          }

          if (isTokenBToTokenAPool) {
            return getToken2ForToken1Price({
              tokenAmount: convertedTokenAmount,
              swapAddress: pool.swap_address,
              client,
            }).then((price) => ({
              price: formatPrice(price),
              poolsForTokenSwap,
            }))
          }
        }

        const [inputPool, outputPool] = poolsForTokenSwap
        return getTokenForTokenPrice({
          tokenAmount: convertedTokenAmount,
          swapAddress: inputPool.swap_address,
          outputSwapAddress: outputPool.swap_address,
          client,
        }).then((price) => ({
          price: formatPrice(price),
          poolsForTokenSwap,
        }))
      })
    )

  /*
   * pick the best price among all the available swap routes.
   * the best price is the highest one.
   * */
  return prices.reduce((result, tokenPrice) => {
    return result?.price < tokenPrice.price ? tokenPrice : result
  }, prices[0])
}

export async function tokenToTokenPriceQuery({
  baseToken,
  fromTokenInfo,
  toTokenInfo,
  amount,
  client,
}): Promise<number | undefined> {
  const formatPrice = (price) =>
    convertMicroDenomToDenom(price, toTokenInfo.decimals)

  const convertedTokenAmount = convertDenomToMicroDenom(
    amount,
    fromTokenInfo.decimals
  )

  if (fromTokenInfo.symbol === toTokenInfo.symbol) {
    return 1
  }

  const shouldQueryBaseTokenForTokenB =
    fromTokenInfo.symbol === baseToken.symbol && toTokenInfo.swap_address

  const shouldQueryTokenBForBaseToken =
    toTokenInfo.symbol === baseToken.symbol && fromTokenInfo.swap_address

  if (shouldQueryBaseTokenForTokenB) {
    const resp = await getToken1ForToken2Price({
      nativeAmount: convertedTokenAmount,
      swapAddress: toTokenInfo.swap_address,
      client,
    })

    return formatPrice(resp)
  } else if (shouldQueryTokenBForBaseToken) {
    return formatPrice(
      await getToken2ForToken1Price({
        tokenAmount: convertedTokenAmount,
        swapAddress: fromTokenInfo.swap_address,
        client,
      })
    )
  }

  return formatPrice(
    await getTokenForTokenPrice({
      tokenAmount: convertedTokenAmount,
      swapAddress: fromTokenInfo.swap_address,
      outputSwapAddress: toTokenInfo.swap_address,
      client,
    })
  )
}
