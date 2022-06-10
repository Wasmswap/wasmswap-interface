import { MsgExecuteContractEncodeObject } from '@cosmjs/cosmwasm-stargate'
import { toUtf8 } from '@cosmjs/encoding'
import { Coin } from '@cosmjs/launchpad'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'

type CreateExecuteMessageArgs = {
  senderAddress: string
  message: Record<string, Record<string, string>>
  swapAddress: string
  funds?: Array<Coin>
}

export const createExecuteMessage = ({
  senderAddress,
  swapAddress,
  message,
  funds,
}: CreateExecuteMessageArgs): MsgExecuteContractEncodeObject => ({
  typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
  value: MsgExecuteContract.fromPartial({
    sender: senderAddress,
    contract: swapAddress,
    msg: toUtf8(JSON.stringify(message)),
    funds: funds || [],
  }),
})
