import {
  convertDenomToMicroDenom,
  convertMicroDenomToDenom,
} from '../util/conversion'
import {
  getToken1ForToken2Price,
  getToken2ForToken1Price,
  getTokenForTokenPrice,
} from '../services/swap'

export async function tokenToTokenPriceQuery({
  baseToken,
  fromTokenInfo,
  toTokenInfo,
  amount,
  chainInfo,
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
        rpcEndpoint: chainInfo.rpc,
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
        rpcEndpoint: chainInfo.rpc,
      })
    )
  }

  return formatPrice(
    await getTokenForTokenPrice({
      tokenAmount: convertedTokenAmount,
      swapAddress: fromTokenInfo.swap_address,
      outputSwapAddress: toTokenInfo.swap_address,
      rpcEndpoint: chainInfo.rpc,
    })
  )
}
