import { coins, StdFee } from '@cosmjs/stargate'

export const defaultExecuteFee: StdFee = {
  amount: coins(250000, process.env.NEXT_PUBLIC_FEE_DENOM!),
  gas: '250000',
}
