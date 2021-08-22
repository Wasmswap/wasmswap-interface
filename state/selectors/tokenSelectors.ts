import { selector } from 'recoil'
import TokenList from '../../public/token_list.json'
import { CW20 } from '../../services/cw20'
import { clientState, walletAddressState } from '../atoms/walletAtoms'
import { tokenAState } from '../atoms/tokenAtoms'

// @reset refresh
export const tokenABalance = selector({
  key: 'tokenABalance',
  get: async ({ get }) => {
    const client = get(clientState)
    const address = get(walletAddressState)
    const tokenName = get(tokenAState).name

    console.log({ client, address, tokenName })

    if (!client) return 0

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
  },
})
