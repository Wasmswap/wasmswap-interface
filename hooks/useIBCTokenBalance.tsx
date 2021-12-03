import { useRecoilValue } from 'recoil'
import { ibcWalletState } from '../state/atoms/walletAtoms'
import { useQuery } from 'react-query'
import { useIBCAssetInfo } from './useIBCAssetInfo'

export const useIBCTokenBalance = (tokenSymbol: string) => {
  const { address, client } = useRecoilValue(ibcWalletState)
  const { denom } = useIBCAssetInfo(tokenSymbol) || {}

  const { data: balance = 0, isLoading } = useQuery(
    [`tokenBalance/${denom}`, address],
    async () => {
      const coin = await client.getBalance(address, denom)
      const amount = coin ? Number(coin.amount) : 0
      return amount / 1000000
    },
    {
      enabled: Boolean(address && denom),
    }
  )

  return { balance, isLoading }
}
