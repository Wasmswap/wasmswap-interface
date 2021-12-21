import { atom } from 'recoil'

export enum TransactionStatus {
  IDLE = '@transaction-status/idle',
  EXECUTING = '@transaction-status/executing',
}

export const transactionStatusState = atom<TransactionStatus>({
  key: 'transactionState',
  default: TransactionStatus.IDLE,
})
