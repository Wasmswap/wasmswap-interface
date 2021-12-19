import {
  getToken1ForToken2Price,
  getToken2ForToken1Price,
  getTokenForTokenPrice,
} from '../services/swap'
import { useEffect, useState } from 'react'
import { TokenInfo } from './useTokenInfo'
import { convertDenomToMicroDenom, convertMicroDenomToDenom } from 'util/conversion'

export const useTokenPrice = (
  fromTokenInfo: TokenInfo,
  toTokenInfo: TokenInfo,
  value: number
) => {
  const [price, setPrice] = useState(0)

  // @todo refactor this to react-query
  useEffect(() => {
    const getPrice = async () => {
      let convertedValue = convertDenomToMicroDenom(value,fromTokenInfo.decimals)
      if (fromTokenInfo.symbol === 'JUNO') {
        return await getToken1ForToken2Price({
          nativeAmount: convertedValue,
          swapAddress: toTokenInfo.swap_address,
          rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
        })
      } else if (toTokenInfo.symbol === 'JUNO') {
        return await getToken2ForToken1Price({
          tokenAmount: convertedValue,
          swapAddress: fromTokenInfo.swap_address,
          rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
        })
      }
      return await getTokenForTokenPrice({
        tokenAmount: convertedValue,
        swapAddress: fromTokenInfo.swap_address,
        outputSwapAddress: toTokenInfo.swap_address,
        rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
      })
    }
    if (fromTokenInfo && value >= 0) {
      getPrice().then((receivedPrice) => {
        setPrice(convertMicroDenomToDenom(receivedPrice, toTokenInfo.decimals))
      })
    }
  }, [fromTokenInfo, toTokenInfo, value])

  return price
}
