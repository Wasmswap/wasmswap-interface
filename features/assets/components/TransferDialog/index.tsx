import styled from 'styled-components'
import { toast } from 'react-toastify'
import { useQueryClient } from 'react-query'
import { Dialog } from 'components/Dialog'
import { Text } from 'components/Text'
import { Button } from 'components/Button'
import { Spinner } from 'components/Spinner'
import { useRecoilValue } from 'recoil'
import React, { useState } from 'react'
import { useTokenBalance } from 'hooks/useTokenBalance'
import { useIBCAssetInfo } from 'hooks/useIBCAssetInfo'
import { useIBCTokenBalance } from 'hooks/useIBCTokenBalance'
import { ibcWalletState, walletState } from 'state/atoms/walletAtoms'
import { WalletCardWithBalance } from './WalletCardWithBalance'
import { WalletCardWithInput } from './WalletCardWithInput'
import { useTransferAssetMutation } from './useTransferAssetMutation'
import { TransactionKind } from './types'

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
  const tokenInfo = useIBCAssetInfo(tokenSymbol)

  const [tokenAmount, setTokenAmount] = useState(0)

  /* get the balances */
  const { balance: availableAssetBalanceOnChain } = useTokenBalance(
    tokenInfo.symbol
  )

  const { balance: ibcTokenMaxAvailableBalance } =
    useIBCTokenBalance(tokenSymbol)

  const queryClient = useQueryClient()

  const { isLoading, mutate: mutateTransferAsset } = useTransferAssetMutation({
    transactionKind,
    tokenAmount,
    tokenInfo,

    onSuccess() {
      // reset cache
      queryClient
        .resetQueries(['tokenBalance', 'ibcTokenBalance'])
        .then((...args) => {
          console.log('Refetched queries', ...args)
        })

      // show toast
      toast.success(
        `🎉 ${transactionKind === 'deposit' ? 'Deposited' : 'Withdrawn'} ${
          tokenInfo.name
        } Successfully`,
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      )

      // close modal
      requestAnimationFrame(onRequestClose)
    },
    onError(error) {
      toast.error(
        `Couldn't ${
          transactionKind === 'deposit' ? 'Deposit' : 'Withdraw'
        } the asset: ${error}`,
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      )
    },
  })

  const { address: ibcWalletAddress } = useRecoilValue(ibcWalletState)
  const { address: walletAddress } = useRecoilValue(walletState)

  const capitalizedTransactionType =
    transactionKind === 'deposit' ? 'Deposit' : 'Withdraw'

  return (
    <Dialog isShowing={isShowing} onRequestClose={onRequestClose}>
      <StyledContent>
        <Text variant="header">{capitalizedTransactionType}</Text>
        <Text css={{ paddingTop: '$12', paddingBottom: '$9' }} variant="body">
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
                walletAddress={ibcWalletAddress}
              />
              <WalletCardWithBalance
                transactionType="incoming"
                transactionOrigin="platform"
                walletAddress={walletAddress}
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
                walletAddress={walletAddress}
              />
              <WalletCardWithBalance
                transactionType="incoming"
                transactionOrigin="wallet"
                walletAddress={ibcWalletAddress}
                balance={ibcTokenMaxAvailableBalance}
                tokenName={tokenInfo.name}
              />
            </>
          )}
        </StyledDivForCards>
        <Button
          size="large"
          disabled={isLoading}
          onClick={isLoading ? undefined : (mutateTransferAsset as () => void)}
          css={{ width: '100%' }}
        >
          {isLoading ? <Spinner instant /> : capitalizedTransactionType}
        </Button>
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
  padding-bottom: 24px;
`
