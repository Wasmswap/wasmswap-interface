import {
  MsgExecuteContractEncodeObject,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { toUtf8 } from '@cosmjs/encoding'
import { isDeliverTxFailure } from '@cosmjs/stargate'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'

import { unsafelyGetDefaultExecuteFee } from '../../util/fees'

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
  const defaultExecuteFee = unsafelyGetDefaultExecuteFee()

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

  const result = await client.signAndBroadcast(
    senderAddress,
    [executeContractMsg1, executeContractMsg2],
    {
      amount: defaultExecuteFee.amount,
      gas: (+defaultExecuteFee.gas * 2).toString(),
    }
  )

  if (isDeliverTxFailure(result)) {
    throw new Error(
      `Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`
    )
  }

  return result
}
