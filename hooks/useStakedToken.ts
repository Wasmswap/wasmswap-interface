import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'
import { walletState, WalletStatusType } from 'state/atoms/walletAtoms'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from 'util/constants'
import {
  getClaims,
  getStakedBalance,
  getTotalStakedBalance,
  getUnstakingDuration,
} from 'services/staking'
import { convertMicroDenomToDenom } from 'util/conversion'
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { useChainInfo } from './useChainInfo'

export const useStakedTokenBalance = (tokenAddress: string) => {
  const { address, status, client } = useRecoilValue(walletState)

  const { data: balance = 0, isLoading } = useQuery(
    [`stakedTokenBalance/${tokenAddress}`, address],
    async () => {
      return convertMicroDenomToDenom(
        await getStakedBalance(address, tokenAddress, client),
        6
      )
    },
    {
      enabled: Boolean(tokenAddress && status === WalletStatusType.connected),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return { balance, isLoading }
}

export const useTotalStaked = (tokenAddress: string) => {
  const [chainInfo] = useChainInfo()
  const { data: total = 0, isLoading } = useQuery(
    [`totalStaked/${tokenAddress}`],
    async () => {
      const client = await CosmWasmClient.connect(chainInfo.rpc)
      return convertMicroDenomToDenom(
        await getTotalStakedBalance(tokenAddress, client),
        6
      )
    },
    {
      enabled: Boolean(tokenAddress && chainInfo?.rpc),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return { total, isLoading }
}

export const useClaims = (tokenAddress: string) => {
  const { address, status, client } = useRecoilValue(walletState)

  const { data: claims = [], isLoading } = useQuery(
    [`claims/${tokenAddress}`, address],
    async () => {
      return getClaims(address, tokenAddress, client)
    },
    {
      enabled: Boolean(tokenAddress && status === WalletStatusType.connected),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )
  return { claims, isLoading }
}

export const useUnstakingDuration = (tokenAddress: string) => {
  const [chainInfo] = useChainInfo()

  const { data: duration = 0, isLoading } = useQuery(
    [`unstakingDuration/${tokenAddress}`],
    async () => {
      const client = await CosmWasmClient.connect(chainInfo.rpc)
      return getUnstakingDuration(tokenAddress, client)
    },
    {
      enabled: Boolean(tokenAddress && chainInfo?.rpc),
      refetchOnMount: false,
      refetchIntervalInBackground: false,
    }
  )

  return { duration, isLoading }
}
