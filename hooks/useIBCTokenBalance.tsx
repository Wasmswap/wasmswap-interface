import { useRecoilValue } from 'recoil'
import { ibcWalletState, WalletStatusType } from '../state/atoms/walletAtoms'
import { useQuery } from 'react-query'
import { getIBCAssetInfo } from './useIBCAssetInfo'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '../util/constants'

const useGetWalletStatus = () => {
  const walletValue = useRecoilValue(ibcWalletState)

  return {
    isConnecting:
      walletValue.status === WalletStatusType.connecting ||
      walletValue.status === WalletStatusType.restored,
    isConnected: walletValue.status === WalletStatusType.connected,
  }
}

export const useIBCTokenBalance = (tokenSymbol) => {
  const {
    address,
    tokenSymbol: connectedTokenSymbol,
    client,
  } = useRecoilValue(ibcWalletState)

  const { isConnecting, isConnected } = useGetWalletStatus()

  const enabled = isConnected && connectedTokenSymbol === tokenSymbol

  const { data: balance = 0, isLoading } = useQuery(
    [`ibcTokenBalance/${tokenSymbol}`, address],
    async () => {
      const { denom } = getIBCAssetInfo(tokenSymbol)
      const coin = await client.getBalance(address, denom)
      const amount = coin ? Number(coin.amount) : 0
      return amount / 1000000
    },
    {
      enabled,
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return { balance, enabled, isLoading: isLoading || isConnecting }
}
