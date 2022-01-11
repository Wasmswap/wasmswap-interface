import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'
import { getClaimableRewards, getRewardsInfo } from 'services/rewards'
import { walletState, WalletStatusType } from 'state/atoms/walletAtoms'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from 'util/constants'
import { convertMicroDenomToDenom } from 'util/conversion'
import { useChainInfo } from './useChainInfo'

export const useClaimableRewardsBalance = (
  rewardsAddress: string,
  decimals: number
) => {
  const { address, status, client } = useRecoilValue(walletState)

  const { data: rewards = 0, isLoading } = useQuery(
    [`claimableRewards/${rewardsAddress}`, address],
    async () => {
      return convertMicroDenomToDenom(
        await getClaimableRewards(address, rewardsAddress, client),
        decimals
      )
    },
    {
      enabled: Boolean(rewardsAddress && status === WalletStatusType.connected),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return [rewards, isLoading]
}

export const useRewardsInfo = (rewardsAddress: string) => {
  const [chainInfo] = useChainInfo()

  const { data: info = {}, isLoading } = useQuery(
    `rewardsInfo/${rewardsAddress}`,
    async () => {
      const client = await CosmWasmClient.connect(chainInfo.rpc)
      return getRewardsInfo(rewardsAddress, client)
    },
    {
      enabled: Boolean(rewardsAddress && chainInfo?.rpc),
      refetchOnMount: false,
      refetchIntervalInBackground: false,
    }
  )

  return { info, isLoading }
}
