import styled from 'styled-components'
import { Dialog } from '../Dialog'
import { Text } from '../Text'
import { WalletCardWithInput } from './WalletCardWithInput'
import { WalletCardWithBalance } from './WalletCardWithBalance'
import { Button } from '../Button'
import { useState } from 'react'
import { TransactionKind } from './types'
import { useIBCAssetInfo } from 'hooks/useIBCAssetInfo'
import { useConnectIBCWallet } from 'hooks/useConnectIBCWallet'
import { useRecoilState, useRecoilValue } from 'recoil'
import { ibcWalletState, walletState } from 'state/atoms/walletAtoms'
import { useTokenBalance } from 'hooks/useTokenBalance'
import { useIBCTokenBalance } from 'hooks/useIBCTokenBalance'
import { BroadcastTxResponse, Coin, MsgTransferEncodeObject, StdFee } from '@cosmjs/stargate'
import Long from 'long'
import { Height } from '@cosmjs/stargate/build/codec/ibc/core/client/v1/client'
import { MsgTransfer } from '@cosmjs/stargate/build/codec/ibc/applications/transfer/v1/tx'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'

type TransferDialogProps = {
  tokenSymbol: string
  transactionKind: TransactionKind
  isShowing: boolean
  onRequestClose: () => void
}

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
    memo = "",
    client: SigningCosmWasmClient
  ): Promise<BroadcastTxResponse> => {
    const timeoutTimestampNanoseconds = timeoutTimestamp
      ? Long.fromNumber(timeoutTimestamp).multiply(1_000_000_000)
      : undefined;
    const transferMsg: MsgTransferEncodeObject = {
      typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
      value: MsgTransfer.fromPartial({
        sourcePort: sourcePort,
        sourceChannel: sourceChannel,
        sender: senderAddress,
        receiver: recipientAddress,
        token: transferAmount,
        timeoutHeight: timeoutHeight,
        timeoutTimestamp: timeoutTimestampNanoseconds,
      }),
    };
    return client.signAndBroadcast(senderAddress, [transferMsg], fee, memo);
  }

export const TransferDialog = ({
  tokenSymbol,
  transactionKind,
  isShowing,
  onRequestClose,
}: TransferDialogProps) => {
  const capitalizedTransactionType =
    transactionKind === 'deposit' ? 'Deposit' : 'Withdraw'

  const tokenInfo = useIBCAssetInfo(tokenSymbol)

  console.log('connected')
  const { address: ibcAddress, client: ibcClient} = useRecoilValue(ibcWalletState)

  const [tokenAmount, setTokenAmount] = useState(0)
  const {balance: ibcTokenMaxAvailableBalance} = useIBCTokenBalance(tokenInfo.denom)
  const walletAddressTransferringAssetsFrom = ibcAddress

  const {balance: availableAssetBalanceOnChain} = useTokenBalance({native:true,denom:tokenInfo.juno_denom,token_address:"",chain_id:"",swap_address:"",symbol:"",name:"",decimals:1,logoURI:"",tags:[]});

  const {address, client} = useRecoilValue(walletState)
  const walletAddressTransferringAssetsTo =
    address
  const arbitrarySwapFee = 0.03 

  const ibcTransfer = async () => {
    const time = new Date()
    console.log(time.getTime())
    const time_seconds = Math.floor(time.getTime() / 1000)
    const timeout = time_seconds + 300
    if (transactionKind == 'deposit') {
      await ibcClient.sendIbcTokens(ibcAddress,address,{amount: (tokenAmount*1000000).toString(), denom: tokenInfo.denom},"transfer",tokenInfo.channel,undefined, timeout)
    } else if (transactionKind == 'withdraw') {
      console.log(tokenAmount)
      console.log(tokenAmount*1000000)
      await sendIbcTokens(address,ibcAddress,{amount: (tokenAmount*1000000).toString(), denom: tokenInfo.juno_denom},"transfer",tokenInfo.juno_channel,undefined, timeout, client.fees.exec,'',client)
    }
  }

  return (
    <Dialog isShowing={isShowing} onRequestClose={onRequestClose}>
      <StyledContent>
        <Text type="title">{capitalizedTransactionType}</Text>
        <Text paddingTop="24" paddingBottom="18" variant="light">
          How many {tokenInfo.name} would you like to {transactionKind}?
        </Text>
        <StyledDivForCards>
          {transactionKind === 'deposit' && (
            <>
              <WalletCardWithInput
                transactionType="outgoing"
                transactionOrigin="wallet"
                value={tokenAmount}
                onChange={setTokenAmount}
                tokenSymbol={tokenSymbol}
                maxValue={ibcTokenMaxAvailableBalance}
                walletAddress={walletAddressTransferringAssetsFrom}
              />
              <WalletCardWithBalance
                transactionType="incoming"
                transactionOrigin="platform"
                walletAddress={walletAddressTransferringAssetsTo}
                balance={availableAssetBalanceOnChain}
                tokenName={tokenInfo.name}
              />
            </>
          )}
          {transactionKind === 'withdraw' && (
            <>
              <WalletCardWithInput
                transactionType="outgoing"
                transactionOrigin="platform"
                value={tokenAmount}
                onChange={setTokenAmount}
                tokenSymbol={tokenSymbol}
                maxValue={availableAssetBalanceOnChain}
                walletAddress={walletAddressTransferringAssetsTo}
              />
              <WalletCardWithBalance
                transactionType="incoming"
                transactionOrigin="wallet"
                walletAddress={walletAddressTransferringAssetsFrom}
                balance={ibcTokenMaxAvailableBalance}
                tokenName={tokenInfo.name}
              />
            </>
          )}
        </StyledDivForCards>
        <StyledDivForFee>
          <Text type="microscopic" variant="light">
            Transaction fees
          </Text>
          <Text type="microscopic" variant="bold" paddingLeft="10">
            ${arbitrarySwapFee.toFixed(2)}
          </Text>
        </StyledDivForFee>
        <Button size="humongous" onClick={()=>ibcTransfer()}>{capitalizedTransactionType}</Button>
      </StyledContent>
    </Dialog>
  )
}

const StyledContent = styled.div`
  padding: 0 24px 24px;
`

const StyledDivForCards = styled.div`
  display: grid;
  row-gap: 16px;
`

const StyledDivForFee = styled.div`
  display: flex;
  align-items: center;
  padding: 18px 0;
`
