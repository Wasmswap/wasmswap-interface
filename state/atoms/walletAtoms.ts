import { atom } from 'recoil'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'

export const walletAddressState = atom({
  key: 'walletAddressState',
  default: '',
})

export const clientState = atom<SigningCosmWasmClient | null>({
  key: 'clientState',
  default: null,
})
