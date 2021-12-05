import {
  getNativeForTokenPrice,
  getTokenForNativePrice,
  getTokenForTokenPrice,
} from '../services/swap'
import { useEffect, useState } from 'react'
import { TokenInfo } from './useTokenInfo'

export const useTokenPrice = (
  fromTokenInfo: TokenInfo,
  toTokenInfo: TokenInfo,
  value: number
) => {
  const [price, setPrice] = useState(0)

  // @todo refactor this to react-query
  useEffect(() => {
    const getPrice = async () => {
      if (fromTokenInfo.symbol === 'CONST') {
        console.log("HERE!!!", value, toTokenInfo);
        return await getNativeForTokenPrice({
          nativeAmount: value,
          swapAddress: toTokenInfo.swap_address,
          rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
        })
      } else if (fromTokenInfo.token_address && !toTokenInfo.token_address) {
        return await getTokenForNativePrice({
          tokenAmount: value,
          swapAddress: fromTokenInfo.swap_address,
          rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
        })
      }
      return await getTokenForTokenPrice({
        tokenAmount: value * 1000000,
        swapAddress: fromTokenInfo.swap_address,
        outputSwapAddress: toTokenInfo.swap_address,
        rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
      })
    }
    if (fromTokenInfo && value >= 0) {
      getPrice().then((receivedPrice) => {
        setPrice(receivedPrice / 1000000)
      })
    }
  }, [fromTokenInfo, toTokenInfo, value])

  return price
}
