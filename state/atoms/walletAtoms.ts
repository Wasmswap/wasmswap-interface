import { atom } from 'recoil'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { SigningStargateClient } from '@cosmjs/stargate'

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

export const ibcWalletState = atom<{
  client: SigningStargateClient | null
  address: string
}>({
  key: 'ibcWalletState',
  default: {
    client: null,
    address: '',
  },
  dangerouslyAllowMutability: true,
})