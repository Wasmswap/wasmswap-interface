import { useRecoilValue } from 'recoil'
import { walletState } from '../state/atoms/walletAtoms'
import { useEffect, useState } from 'react'
import { CW20 } from '../services/cw20'
import { transactionStatusState } from '../state/atoms/transactionAtoms'
import { TokenInfo } from './useTokenInfo'

export const useTokenBalance = (tokenInfo: TokenInfo) => {
  const [balance, setBalance] = useState(0)
  const { address, client } = useRecoilValue(walletState)
  const transactionStatus = useRecoilValue(transactionStatusState)

  useEffect(() => {
    const getTokenBalance = async () => {
      if (!client || !address || !tokenInfo) return 0

      if (tokenInfo.symbol === 'JUNO') {
        const coin = await client.getBalance(address, 'ujuno')
        console.log(coin)
        const res = coin ? +coin.amount : 0
        return res / 1000000
      }

      const res = +(await CW20(client).use(tokenInfo.token_address).balance(address))
      return res / 1000000
    }
    getTokenBalance().then((balance) => {
      setBalance(balance)
    })
  }, [tokenInfo, address, client, transactionStatus])

  return balance
}
