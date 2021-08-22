import { atom } from 'recoil'

export const transactionState = atom<{
  state: 'IDLE' | 'SUCCESS' | 'ERROR' | 'FETCHING'
  message: string | null
}>({
  key: 'transactionState',
  default: {
    state: 'IDLE',
    message: null,
  },
})
