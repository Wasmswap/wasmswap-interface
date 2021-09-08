import { atom } from 'recoil'

type TransactionStatusType =
  | 'IDLE'
  | 'EXECUTING_SWAP'

export const transactionStatusState = atom<TransactionStatusType>({
  key: 'transactionState',
  default: 'IDLE',
})
