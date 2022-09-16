import { getSwapInfo } from '../services/swap'

const safeNum = (attr: string | undefined): number | undefined =>
  attr != undefined ? Number(attr) : undefined

export type SwapInfoResponse = {
  swap_address: string
  lp_token_supply: number
  lp_token_address: string
  token1_denom: string
  token1_reserve: number
  token2_denom: string
  token2_reserve: number
  owner?: string
  lp_fee_percent?: number
  protocol_fee_percent?: number
  protocol_fee_recipient?: string
}

export async function querySwapInfo({
  context: { client },
  swap_address,
}): Promise<SwapInfoResponse> {
  const swap = await getSwapInfo(swap_address, client)

  return {
    ...swap,
    swap_address,
    token1_reserve: Number(swap.token1_reserve),
    token2_reserve: Number(swap.token2_reserve),
    lp_token_supply: Number(swap.lp_token_supply),
    protocol_fee_percent: safeNum(swap.protocol_fee_percent),
    lp_fee_percent: safeNum(swap.lp_fee_percent),
  }
}
