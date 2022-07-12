import { useWallet } from '@noahsaso/cosmodal'
import { useMutation } from 'react-query'

import { usePoolFromListQueryById } from '../queries/usePoolsListQuery'
import { stakeTokens, unstakeTokens } from '../services/staking'
import { useSwapInfo } from './useSwapInfo'

type UseBondTokensArgs = {
  poolId: string
} & Parameters<typeof useMutation>[2]

export const useBondTokens = ({ poolId, ...options }: UseBondTokensArgs) => {
  const [pool] = usePoolFromListQueryById({ poolId })
  const { address, signingCosmWasmClient } = useWallet()
  const [swap] = useSwapInfo({ poolId })

  return useMutation(async (amount: number) => {
    return stakeTokens(
      address,
      pool.staking_address,
      swap.lp_token_address,
      amount,
      signingCosmWasmClient
    )
  }, options)
}

type UseUnbondTokensArgs = {
  poolId: string
} & Parameters<typeof useMutation>[2]

export const useUnbondTokens = ({
  poolId,
  ...options
}: UseUnbondTokensArgs) => {
  const [pool] = usePoolFromListQueryById({ poolId })
  const { address, signingCosmWasmClient } = useWallet()

  return useMutation(async (amount: number) => {
    return unstakeTokens(
      address,
      pool.staking_address,
      amount,
      signingCosmWasmClient
    )
  }, options)
}
