import { atom } from 'recoil'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'

export const walletState = atom<{
  client: SigningCosmWasmClient | null
  address: string
}>({
  key: 'walletState',
  default: {
    client: null,
    address: '',
  },
  dangerouslyAllowMutability: true,
})
