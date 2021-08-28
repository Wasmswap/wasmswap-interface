import { atom } from 'recoil'

type TransactionStatusType =
  | 'IDLE'
  | 'APPROVING_ALLOWANCE'
  | 'ALLOWANCE_APPROVED'
  | 'EXECUTING_SWAP'

export const transactionStatusState = atom<TransactionStatusType>({
  key: 'transactionState',
  default: 'IDLE',
})
