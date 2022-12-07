import { NETWORK_FEE } from 'util/constants'
import { useCosmWasmClient } from '../../../hooks/useCosmWasmClient'
import { getSwapFee, FeeResponse } from '../../../services/swap'
import { useTokenToTokenPrice } from './'
import { usePoolsListQuery } from '../../../queries/usePoolsListQuery'
import { useQuery } from 'react-query'

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
  const { data: fee1 } = useSwapFeeQuery(poolId1)
  const { data: fee2 } = useSwapFeeQuery(poolId2)

  // default to NETWORK_FEE constant
  let swapFee = NETWORK_FEE * 100

  // use fee for direct token swap or inputPool passthrough if set
  if (fee1 && (fee1.lp_fee_percent || fee1.protocol_fee_percent)) {
    swapFee =
      Number(fee1.lp_fee_percent || 0) + Number(fee1.protocol_fee_percent || 0)
  }
  // add fee for outputPool passthrough pool if set
  if (fee2 && (fee2.lp_fee_percent || fee2.protocol_fee_percent)) {
    swapFee +=
      Number(fee2.lp_fee_percent || 0) + Number(fee2.protocol_fee_percent || 0)

    // add default network fee if not set in outputPool passhthrough
  } else if (poolId2 !== '') {
    swapFee += NETWORK_FEE * 100
  }

  return swapFee
}

export const useSwapFeeQuery = (poolId: string, options = {}) => {
  const { data: poolsListResponse } = usePoolsListQuery()
  const client = useCosmWasmClient()
  const pool = poolsListResponse?.poolsById[poolId]

  return useQuery<FeeResponse, Error, FeeResponse, (string | undefined)[]>(
    [`swapFee/${poolId}`],
    () => getSwapFee(pool.swap_address, client),
    {
      enabled: Boolean(client && poolId && pool),
      refetchOnMount: false,
      ...options,
    }
  )
}
