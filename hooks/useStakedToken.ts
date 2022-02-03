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
import { useBaseTokenInfo, useTokenInfo } from './useTokenInfo'
import { useSwapInfo } from './useSwapInfo'
import { useTokenDollarValue } from './useTokenDollarValue'

export const useGetPoolTokensDollarValue = ({ poolId, tokenAmount }) => {
  const tokenA = useBaseTokenInfo()

  const [swapInfo, isLoading] = useSwapInfo({ poolId })
  const [junoPrice, isPriceLoading] = useTokenDollarValue(tokenA.symbol)

  if (swapInfo) {
    return [
      convertMicroDenomToDenom(
        (tokenAmount / swapInfo.lp_token_supply) *
          swapInfo.token1_reserve *
          junoPrice *
          2,
        6
      ),
      isLoading || isPriceLoading,
    ]
  }

  return [0, isLoading || isPriceLoading]
}

export const useStakedTokenBalance = (tokenSymbol: string) => {
  const { address, status, client } = useRecoilValue(walletState)

  const token = useTokenInfo(tokenSymbol)

  const { data = 0, isLoading } = useQuery<number>(
    [`stakedTokenBalance/${tokenSymbol}`, address],
    async () => {
      return convertMicroDenomToDenom(
        await getStakedBalance(address, token.staking_address, client),
        6
      )
    },
    {
      enabled: Boolean(
        token?.staking_address && status === WalletStatusType.connected
      ),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return [data, isLoading] as const
}

export const useTotalStaked = (tokenSymbol: string) => {
  const token = useTokenInfo(tokenSymbol)
  const [chainInfo] = useChainInfo()

  const { data = 0, isLoading } = useQuery(
    `totalStaked/${tokenSymbol}`,
    async () => {
      const client = await CosmWasmClient.connect(chainInfo.rpc)
      return convertMicroDenomToDenom(
        await getTotalStakedBalance(token.staking_address, client),
        6
      )
    },
    {
      enabled: Boolean(token?.staking_address && chainInfo?.rpc),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return [data, isLoading] as const
}

export const useGetClaims = (tokenSymbol: string) => {
  const token = useTokenInfo(tokenSymbol)
  const { address, status, client } = useRecoilValue(walletState)

  const { data = [], isLoading } = useQuery(
    [`claims/${tokenSymbol}`, address],
    async () => {
      return getClaims(address, token.staking_address, client)
    },
    {
      enabled: Boolean(
        token?.staking_address && status === WalletStatusType.connected
      ),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )
  return [data, isLoading] as const
}

export const useUnstakingDuration = (tokenSymbol: string) => {
  const token = useTokenInfo(tokenSymbol)
  const [chainInfo] = useChainInfo()

  const { data = 0, isLoading } = useQuery(
    `unstakingDuration/${tokenSymbol}`,
    async () => {
      const client = await CosmWasmClient.connect(chainInfo.rpc)
      return getUnstakingDuration(token?.staking_address, client)
    },
    {
      enabled: Boolean(
        token?.staking_address && status === WalletStatusType.connected
      ),
      refetchOnMount: false,
      refetchIntervalInBackground: false,
    }
  )

  return [data, isLoading] as const
}
