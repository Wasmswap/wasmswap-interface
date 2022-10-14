import { NETWORK_FEE } from 'util/constants'
import { useSwapInfo } from '../../../hooks/useSwapInfo'
import { useTokenToTokenPrice } from './'

export const useSwapFee = ({ tokenA, tokenB }) => {
  const [tokenToTokenPrice] = useTokenToTokenPrice({
    tokenASymbol: tokenA.tokenSymbol,
    tokenBSymbol: tokenB.tokenSymbol,
    tokenAmount: 1,
  })

  // pool_id for direct token swap pools OR inputPool for passthrough swap
  let poolId1: string = ''
  // pool_id for outputPool if passthrough swap
  let poolId2: string = ''
  if (tokenToTokenPrice.poolForDirectTokenAToTokenBSwap) {
    poolId1 = tokenToTokenPrice.poolForDirectTokenAToTokenBSwap.pool_id
  } else if (tokenToTokenPrice.poolForDirectTokenBToTokenASwap) {
    poolId1 = tokenToTokenPrice.poolForDirectTokenBToTokenASwap.pool_id
  } else if (tokenToTokenPrice.passThroughPools) {
    poolId1 = tokenToTokenPrice.passThroughPools[0].inputPool.pool_id
    poolId2 = tokenToTokenPrice.passThroughPools[0].outputPool.pool_id
  }
  const [swapInfo1] = useSwapInfo({
    poolId: poolId1,
    refetchInBackground: false,
  })
  const [swapInfo2] = useSwapInfo({
    poolId: poolId2,
    refetchInBackground: false,
  })

  // default to NETWORK_FEE constant
  let swapFee = NETWORK_FEE * 100

  // use fee for direct token swap or inputPool passthrough if set
  if (
    swapInfo1 &&
    (swapInfo1.lp_fee_percent || swapInfo1.protocol_fee_percent)
  ) {
    swapFee =
      Number(swapInfo1.lp_fee_percent || 0) +
      Number(swapInfo1.protocol_fee_percent || 0)
  }

  // add fee for outputPool passthrough pool if set
  if (
    swapInfo2 &&
    (swapInfo2.lp_fee_percent || swapInfo2.protocol_fee_percent)
  ) {
    swapFee +=
      Number(swapInfo2.lp_fee_percent || 0) +
      Number(swapInfo2.protocol_fee_percent || 0)

    // add default network fee if not set in outputPool passhthrough
  } else if (swapInfo2) {
    swapFee += NETWORK_FEE * 100
  }

  return swapFee
}
