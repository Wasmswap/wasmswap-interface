import { useRecoilValue } from 'recoil'
import { ibcWalletState, WalletStatusType } from '../state/atoms/walletAtoms'
import { useQuery } from 'react-query'
import { getIBCAssetInfo } from './useIBCAssetInfo'

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
  const { address, client } = useRecoilValue(ibcWalletState)
  const { isConnecting, isConnected } = useGetWalletStatus()

  const enabled = isConnected && Boolean(client)

  const { data: balance = 0, isLoading } = useQuery(
    [`tokenBalance/${tokenSymbol}`, address],
    async () => {
      const { denom } = getIBCAssetInfo(tokenSymbol)
      const coin = await client.getBalance(address, denom)
      const amount = coin ? Number(coin.amount) : 0
      return amount / 1000000
    },
    {
      enabled,
    }
  )

  return { balance, enabled, isLoading: isLoading || isConnecting }
}
