import { useRecoilValue } from 'recoil'
import { walletState } from '../state/atoms/walletAtoms'
import { CW20 } from '../services/cw20'
import { TokenInfo } from './useTokenInfo'
import { useQuery } from 'react-query'

export const useTokenBalance = ({
  token_address,
  native,
  denom,
}: Pick<TokenInfo, 'token_address' | 'native' | 'denom'>) => {
  const { address, client } = useRecoilValue(walletState)

  const { data: balance = 0, isLoading } = useQuery(
    [`tokenBalance/${denom}`, address, token_address],
    async () => {
      if (native) {
        const coin = await client.getBalance(address, denom)
        const amount = coin ? Number(coin.amount) : 0
        return amount / 1000000
      }

      if (token_address) {
        const balance = await CW20(client).use(token_address).balance(address)

        return Number(balance) / 1000000
      }
      return 0
    },
    {
      enabled: Boolean(address),
    }
  )

  return { balance, isLoading }
}
