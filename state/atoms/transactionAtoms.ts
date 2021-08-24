import { atom } from 'recoil'

export type State = 'IDLE' | 'APPROVING_ALLOWANCE' | 'ALLOWANCE_APPROVED' | 'EXECUTING_SWAP' 

export const transactionStatusState = atom<
  State
>({
  key: 'transactionState',
  default: 'IDLE',
})
