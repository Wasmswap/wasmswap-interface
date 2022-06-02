import { queryLiquidityBalance } from '../services/liquidity'
import { protectAgainstNaN } from '../util/conversion'

export async function queryMyLiquidity({ swap, address, context: { client } }) {
  const providedLiquidityInMicroDenom = address
    ? await queryLiquidityBalance({
        tokenAddress: swap.lp_token_address,
        client,
        address,
      })
    : 0

  /* provide dollar value for reserves as well */
  const totalReserve: [number, number] = [
    protectAgainstNaN(swap.token1_reserve),
    protectAgainstNaN(swap.token2_reserve),
  ]

  const providedReserve: [number, number] = [
    protectAgainstNaN(
      totalReserve[0] * (providedLiquidityInMicroDenom / swap.lp_token_supply)
    ),
    protectAgainstNaN(
      totalReserve[1] * (providedLiquidityInMicroDenom / swap.lp_token_supply)
    ),
  ]

  return {
    totalReserve,
    providedReserve,
    providedLiquidityInMicroDenom,
  }
}
