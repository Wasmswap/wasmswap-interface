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
  const {
    address,
    tokenSymbol: connectedTokenSymbol,
    client,
  } = useRecoilValue(ibcWalletState)

  const { isConnecting, isConnected } = useGetWalletStatus()

  const enabled =
    isConnected && connectedTokenSymbol === tokenSymbol && Boolean(client)

  const { data: balance = 0, isLoading } = useQuery(
    [`individialIbcTokenBalance/${tokenSymbol}`, address],
    async () => {
      const { denom } = getIBCAssetInfo(tokenSymbol)
      const coin = await client.getBalance(address, denom)
      const test = await client.getAllBalances(address)
      console.log({ coin, test })
      const amount = coin ? Number(coin.amount) : 0
      return amount / 1000000
    },
    {
      enabled,
    }
  )

  console.log({
    balance,
    enabled,
    isLoading,
    isConnecting,
  })

  return { balance, enabled, isLoading: isLoading || isConnecting }
}
