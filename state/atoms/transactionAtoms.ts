import { atom } from 'recoil'

export const transactionStatusState = atom<
  'IDLE' | 'SUCCESS' | 'ERROR' | 'FETCHING'
>({
  key: 'transactionState',
  default: 'IDLE',
})
