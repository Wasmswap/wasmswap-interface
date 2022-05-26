import { useSwapInfo } from 'hooks/useSwapInfo'
import { calcPoolTokenValue } from 'util/conversion'

type UsePoolPairTokenAmountArgs = {
  tokenAmountInMicroDenom: number
  tokenPairIndex: 0 | 1
  poolId: string
}

/* probably not the best but can get what's a token worth in a given pool */
export const usePoolPairTokenAmount = ({
  tokenAmountInMicroDenom,
  tokenPairIndex,
  poolId,
}: UsePoolPairTokenAmountArgs) => {
  const [swapInfo, isLoading] = useSwapInfo({ poolId })
  const tokenReserves =
    swapInfo?.[tokenPairIndex === 0 ? 'token1_reserve' : 'token2_reserve'] ?? 0

  const amount = tokenReserves
    ? calcPoolTokenValue({
        tokenAmountInMicroDenom,
        tokenSupply: swapInfo.lp_token_supply,
        tokenReserves,
      })
    : 0

  return [amount, isLoading] as const
}
