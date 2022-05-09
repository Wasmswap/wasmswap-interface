import { getSwapInfo } from '../services/swap'

export async function querySwapInfo({ context: { client }, swap_address }) {
  const swap = await getSwapInfo(swap_address, client)
  return {
    ...swap,
    swap_address,
    token1_reserve: Number(swap.token1_reserve),
    token2_reserve: Number(swap.token2_reserve),
    lp_token_supply: Number(swap.lp_token_supply),
  }
}
