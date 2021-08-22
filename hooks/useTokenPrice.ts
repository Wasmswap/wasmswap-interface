import {
  getNativeForTokenPrice,
  getTokenForNativePrice,
} from '../services/swap'
import { useEffect, useState } from 'react'

const contract = process.env.NEXT_PUBLIC_AMM_CONTRACT_ADDRESS

export const useTokenPrice = (tokenName: string, value: number) => {
  const [price, setPrice] = useState(0)

  useEffect(() => {
    const getPrice = async () => {
      if (tokenName === 'JUNO') {
        return await getNativeForTokenPrice({
          nativeAmount: value * 1000000,
          swapAddress: contract as string,
          rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
        })
      }
      return await getTokenForNativePrice({
        tokenAmount: value * 1000000,
        swapAddress: contract as string,
        rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
      })
    }
    if (tokenName && value > 0) {
      getPrice().then((receivedPrice) => {
        setPrice(receivedPrice / 1000000)
      })
    }
  }, [tokenName, value])

  return price
}
