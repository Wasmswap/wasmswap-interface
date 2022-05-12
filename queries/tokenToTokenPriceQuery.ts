import {
  getToken1ForToken2Price,
  getToken2ForToken1Price,
  getTokenForTokenPrice,
} from '../services/swap'
import {
  convertDenomToMicroDenom,
  convertMicroDenomToDenom,
} from '../util/conversion'

/*
 * assuming theres always a pool with `baseToken` including either a `tokenA` or `tokenB` pair
 * */
function findTokenPools({ baseToken, tokenA, tokenB, poolsList }) {
  const isPoolMatchingTokens = ({
    pool: {
      pool_assets: [poolTokenA, poolTokenB],
    },
    tokenA,
    tokenB,
  }) => {
    const matchingAB =
      poolTokenA.symbol === tokenA.symbol && poolTokenB.symbol === tokenB.symbol

    const matchingBA =
      poolTokenA.symbol === tokenB.symbol && poolTokenB.symbol === tokenA.symbol

    return { matchingAB, matchingBA }
  }

  return poolsList.reduce(
    (state, pool) => {
      /* bail early if we found a streamlinePool` */
      if (state.streamlinePool) return state

      const matchingStreamlinePair = isPoolMatchingTokens({
        pool,
        tokenA,
        tokenB,
      })

      if (matchingStreamlinePair.matchingAB) {
        state.streamlinePoolAB = pool
        return state
      }
      if (matchingStreamlinePair.matchingBA) {
        state.streamlinePoolBA = pool
        return state
      }

      const matchingStreamlineBaseAndTokenA = isPoolMatchingTokens({
        pool,
        tokenA: baseToken,
        tokenB: tokenA,
      })
      if (matchingStreamlineBaseAndTokenA.matchingAB) {
        state.baseTokenBPool = pool
        return state
      }

      const matchingStreamlineBaseAndTokenB = isPoolMatchingTokens({
        pool,
        tokenA: baseToken,
        tokenB,
      })
      if (matchingStreamlineBaseAndTokenB.matchingAB) {
        state.baseTokenBPool = pool
        return state
      }

      return state
    },
    {
      streamlinePoolAB: null,
      streamlinePoolBA: null,
      baseTokenAPool: null,
      baseTokenBPool: null,
    }
  )
}

export async function tokenToTokenPriceQueryWithPools({
  baseToken,
  tokenA,
  tokenB,
  poolsList,
  amount,
  client,
}): Promise<number | undefined> {
  if (tokenA.symbol === tokenB.symbol) {
    return 1
  }

  const formatPrice = (price) =>
    convertMicroDenomToDenom(price, tokenB.decimals)

  const convertedTokenAmount = convertDenomToMicroDenom(amount, tokenA.decimals)

  const { streamlinePoolAB, streamlinePoolBA, baseTokenAPool, baseTokenBPool } =
    findTokenPools({
      baseToken,
      tokenA,
      tokenB,
      poolsList,
    })

  if (streamlinePoolAB) {
    return formatPrice(
      await getToken1ForToken2Price({
        nativeAmount: convertedTokenAmount,
        swapAddress: streamlinePoolAB.swap_address,
        client,
      })
    )
  }
  if (streamlinePoolBA) {
    return formatPrice(
      await getToken2ForToken1Price({
        tokenAmount: convertedTokenAmount,
        swapAddress: streamlinePoolBA.swap_address,
        client,
      })
    )
  }

  return formatPrice(
    await getTokenForTokenPrice({
      tokenAmount: convertedTokenAmount,
      swapAddress: baseTokenAPool.swap_address,
      outputSwapAddress: baseTokenBPool.swap_address,
      client,
    })
  )
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

  if (fromTokenInfo.symbol === baseToken.symbol && toTokenInfo.swap_address) {
    return formatPrice(
      await getToken1ForToken2Price({
        nativeAmount: convertedTokenAmount,
        swapAddress: toTokenInfo.swap_address,
        client,
      })
    )
  } else if (
    toTokenInfo.symbol === baseToken.symbol &&
    fromTokenInfo.swap_address
  ) {
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
