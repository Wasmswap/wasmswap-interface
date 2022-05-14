import { useMutation } from 'react-query'
import { useRecoilValue } from 'recoil'

import { stakeTokens, unstakeTokens } from '../services/staking'
import { walletState } from '../state/atoms/walletAtoms'
import { useSwapInfo } from './useSwapInfo'
import { useTokenInfoByPoolId } from './useTokenInfo'

type UseBondTokensArgs = {
  poolId: string
} & Parameters<typeof useMutation>[2]

export const useBondTokens = ({ poolId, ...options }: UseBondTokensArgs) => {
  const token = useTokenInfoByPoolId(poolId)
  const { address, client } = useRecoilValue(walletState)
  const [swap] = useSwapInfo({ poolId })

  return useMutation(async (amount: number) => {
    return stakeTokens(
      address,
      token.staking_address,
      swap.lp_token_address,
      amount,
      client
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
  const token = useTokenInfoByPoolId(poolId)
  const { address, client } = useRecoilValue(walletState)

  return useMutation(async (amount: number) => {
    return unstakeTokens(address, token.staking_address, amount, client)
  }, options)
}
