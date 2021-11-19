import { useRecoilValue } from 'recoil'
import { ibcWalletState } from '../state/atoms/walletAtoms'
import { useQuery } from 'react-query'

export const useIBCTokenBalance = (denom:string) => {
  const { address, client } = useRecoilValue(ibcWalletState)

  const { data: balance = 0, isLoading } = useQuery(
    [`tokenBalance/${denom}`, address],
    async () => {
        const coin = await client.getBalance(address, denom)
        const amount = coin ? Number(coin.amount) : 0
        return amount / 1000000
    },
    {
      enabled: Boolean(address),
    }
  )

  return { balance, isLoading }
}
