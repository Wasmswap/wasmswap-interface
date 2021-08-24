import {
  getNativeForTokenPrice,
  getTokenForNativePrice,
} from '../services/swap'
import { useEffect, useState } from 'react'
import { TokenInfo } from './useTokenInfo'

export const useTokenPrice = (fromTokenInfo: TokenInfo, toTokenInfo: TokenInfo, value: number) => {
  const [price, setPrice] = useState(0)

  useEffect(() => {
    const getPrice = async () => {
      if (fromTokenInfo.symbol === 'JUNO') {
        return await getNativeForTokenPrice({
          nativeAmount: value * 1000000,
          swapAddress: toTokenInfo.swap_address,
          rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
        })
      }
      return await getTokenForNativePrice({
        tokenAmount: value * 1000000,
        swapAddress: fromTokenInfo.swap_address,
        rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
      })
    }
    if (fromTokenInfo && value > 0) {
      getPrice().then((receivedPrice) => {
        setPrice(receivedPrice / 1000000)
      })
    }
  }, [fromTokenInfo, toTokenInfo, value])

  return price
}
