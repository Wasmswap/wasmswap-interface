import {
  DeliverTxResponse,
  Coin,
  MsgTransferEncodeObject,
  StdFee,
} from '@cosmjs/stargate'
import { Height } from 'cosmjs-types/ibc/core/client/v1/client'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import Long from 'long'
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx'
import { useMutation } from 'react-query'
import dayjs from 'dayjs'
import { useRecoilValue } from 'recoil'
import { ibcWalletState, walletState } from '../../state/atoms/walletAtoms'
import { TransactionKind } from './types'
import { IBCAssetInfo } from '../../hooks/useIBCAssetInfo'
import { defaultExecuteFee } from 'util/fees'
import { convertDenomToMicroDenom } from 'util/conversion'

type UseTransferAssetMutationArgs = {
  transactionKind: TransactionKind
  tokenAmount: number
  tokenInfo: IBCAssetInfo
} & Parameters<typeof useMutation>[2]

const sendIbcTokens = (
  senderAddress: string,
  recipientAddress: string,
  transferAmount: Coin,
  sourcePort: string,
  sourceChannel: string,
  timeoutHeight: Height | undefined,
  /** timeout in seconds */
  timeoutTimestamp: number | undefined,
  fee: StdFee,
  memo = '',
  client: SigningCosmWasmClient
): Promise<DeliverTxResponse> => {
  const timeoutTimestampNanoseconds = timeoutTimestamp
    ? Long.fromNumber(timeoutTimestamp).multiply(1_000_000_000)
    : undefined
  const transferMsg: MsgTransferEncodeObject = {
    typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
    value: MsgTransfer.fromPartial({
      sourcePort: sourcePort,
      sourceChannel: sourceChannel,
      sender: senderAddress,
      receiver: recipientAddress,
      token: transferAmount,
      timeoutHeight: timeoutHeight,
      timeoutTimestamp: timeoutTimestampNanoseconds,
    }),
  }
  return client.signAndBroadcast(senderAddress, [transferMsg], fee, memo)
}

export const useTransferAssetMutation = ({
  transactionKind,
  tokenAmount,
  tokenInfo,
  ...mutationArgs
}: UseTransferAssetMutationArgs) => {
  const { address, client } = useRecoilValue(walletState)
  const { address: ibcAddress, client: ibcClient } =
    useRecoilValue(ibcWalletState)

  return useMutation(async () => {
    const timeout = dayjs().second() + 300

    if (transactionKind == 'deposit') {
      return await ibcClient.sendIbcTokens(
        ibcAddress,
        address,
        { amount: (convertDenomToMicroDenom(tokenAmount, tokenInfo.decimals)).toString(), denom: tokenInfo.denom },
        'transfer',
        tokenInfo.channel,
        undefined,
        timeout,
        defaultExecuteFee
      )
    }

    if (transactionKind == 'withdraw') {
      return await sendIbcTokens(
        address,
        ibcAddress,
        {
          amount: convertDenomToMicroDenom(tokenAmount, tokenInfo.decimals).toString(),
          denom: tokenInfo.juno_denom,
        },
        'transfer',
        tokenInfo.juno_channel,
        undefined,
        timeout,
        defaultExecuteFee,
        '',
        client
      )
    }
  }, mutationArgs)
}
