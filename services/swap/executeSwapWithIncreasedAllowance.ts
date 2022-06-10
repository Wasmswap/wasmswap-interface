import {
  MsgExecuteContractEncodeObject,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { toUtf8 } from '@cosmjs/encoding'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'

import { validateTransactionSuccess } from '../../util/messages'

type ExecuteSwapWithIncreasedAllowanceArgs = {
  tokenAmount: number
  swapAddress: string
  senderAddress: string
  tokenAddress: string
  swapMessage: Record<string, Record<string, string>>
  client: SigningCosmWasmClient
}

export const executeSwapWithIncreasedAllowance = async ({
  tokenAmount,
  swapAddress,
  senderAddress,
  tokenAddress,
  swapMessage,
  client,
}: ExecuteSwapWithIncreasedAllowanceArgs) => {
  const increaseAllowanceMessage = {
    increase_allowance: {
      amount: `${tokenAmount}`,
      spender: `${swapAddress}`,
    },
  }

  const executeContractMsg1: MsgExecuteContractEncodeObject = {
    typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    value: MsgExecuteContract.fromPartial({
      sender: senderAddress,
      contract: tokenAddress,
      msg: toUtf8(JSON.stringify(increaseAllowanceMessage)),
      funds: [],
    }),
  }

  const executeContractMsg2: MsgExecuteContractEncodeObject = {
    typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    value: MsgExecuteContract.fromPartial({
      sender: senderAddress,
      contract: swapAddress,
      msg: toUtf8(JSON.stringify(swapMessage)),
      funds: [],
    }),
  }

  return validateTransactionSuccess(
    await client.signAndBroadcast(
      senderAddress,
      [executeContractMsg1, executeContractMsg2],
      'auto'
    )
  )
}
