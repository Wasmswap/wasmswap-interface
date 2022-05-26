import {
  getProvidedStakedAmount,
  getTotalStakedAmount,
} from '../services/staking'
import { protectAgainstNaN } from '../util/conversion'

export async function queryStakedLiquidity({
  address,
  stakingAddress,
  totalReserve,
  swap,
  context: { client },
}) {
  const [providedStakedAmountInMicroDenom, totalStakedAmountInMicroDenom] =
    stakingAddress
      ? await Promise.all([
          address
            ? getProvidedStakedAmount(address, stakingAddress, client)
            : new Promise<number>((resolve) => resolve(0)),
          getTotalStakedAmount(stakingAddress, client),
        ])
      : [0, 0]

  const totalStakedReserve: [number, number] = [
    protectAgainstNaN(
      totalReserve[0] * (totalStakedAmountInMicroDenom / swap.lp_token_supply)
    ),
    protectAgainstNaN(
      totalReserve[1] * (totalStakedAmountInMicroDenom / swap.lp_token_supply)
    ),
  ]

  const providedStakedReserve: [number, number] = [
    protectAgainstNaN(
      totalReserve[0] *
        (providedStakedAmountInMicroDenom / swap.lp_token_supply)
    ),
    protectAgainstNaN(
      totalReserve[1] *
        (providedStakedAmountInMicroDenom / swap.lp_token_supply)
    ),
  ]

  return {
    providedStakedAmountInMicroDenom,
    totalStakedAmountInMicroDenom,
    totalStakedReserve,
    providedStakedReserve,
  }
}
