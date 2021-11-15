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
import { Coin } from '@cosmjs/stargate'
import Long from 'long'

type TransferDialogProps = {
  tokenSymbol: string
  transactionKind: TransactionKind
  isShowing: boolean
  onRequestClose: () => void
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
  const {balance: tokenMaxAvailableBalance} = useIBCTokenBalance(tokenInfo.denom)
  const walletAddressTransferringAssetsFrom = ibcAddress

  const {address, client} = useRecoilValue(walletState)
  const walletAddressTransferringAssetsTo =
    address
  const availableAssetBalanceOnChain = 399
  const arbitrarySwapFee = 0.03 

  const ibcTransfer = async () => {
    const time = new Date()
    console.log(time.getTime())
    ibcClient.sendIbcTokens(ibcAddress,address,{amount: (tokenAmount*1000000).toString(), denom: tokenInfo.denom},"transfer","channel-207",undefined, time.getTime() + 600000)
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
                maxValue={tokenMaxAvailableBalance}
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
                maxValue={tokenMaxAvailableBalance}
                walletAddress={walletAddressTransferringAssetsFrom}
              />
              <WalletCardWithBalance
                transactionType="incoming"
                transactionOrigin="wallet"
                walletAddress={walletAddressTransferringAssetsTo}
                balance={availableAssetBalanceOnChain}
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
