import { useRecoilValue } from 'recoil'
import { walletState } from '../state/atoms/walletAtoms'
import { useEffect, useState } from 'react'
import TokenList from '../public/token_list.json'
import { CW20 } from '../services/cw20'
import { transactionStatusState } from '../state/atoms/transactionAtoms'

export const useTokenBalance = (tokenName: string) => {
  const [balance, setBalance] = useState(0)
  const { address, client } = useRecoilValue(walletState)
  const transactionStatus = useRecoilValue(transactionStatusState)

  useEffect(() => {
    const getTokenBalance = async () => {
      if (!client || !address) return 0

      if (tokenName === 'JUNO') {
        const coin = await client.getBalance(address, 'ujuno')
        console.log(coin)
        const res = coin ? +coin.amount : 0
        return res / 1000000
      }

      const token = TokenList.tokens.find((x) => x.symbol === tokenName)
      if (!token) return 0

      const res = +(await CW20(client).use(token.address).balance(address))
      return res / 1000000
    }
    getTokenBalance().then((balance) => {
      setBalance(balance)
    })
  }, [tokenName, address, client, transactionStatus])

  return balance
}
