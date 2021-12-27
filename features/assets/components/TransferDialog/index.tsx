import styled from 'styled-components'
import { Dialog } from '../../../../components/Dialog'
import { Text } from '../../../../components/Text'
import { WalletCardWithInput } from './WalletCardWithInput'
import { WalletCardWithBalance } from './WalletCardWithBalance'
import { Button } from '../../../../components/Button'
import React, { useState } from 'react'
import { TransactionKind } from './types'
import { useIBCAssetInfo } from 'hooks/useIBCAssetInfo'
import { useRecoilValue } from 'recoil'
import { ibcWalletState, walletState } from 'state/atoms/walletAtoms'
import { useTokenBalance } from 'hooks/useTokenBalance'
import { useIBCTokenBalance } from 'hooks/useIBCTokenBalance'
import { useTransferAssetMutation } from './useTransferAssetMutation'
import { Spinner } from '../../../../components/Spinner'
import { toast } from 'react-toastify'
import { useQueryClient } from 'react-query'

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

  const arbitrarySwapFee = 0.03

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
        <StyledDivForFee>
          <Text type="microscopic" variant="light">
            Transaction fees
          </Text>
          <Text type="microscopic" variant="bold" paddingLeft="10">
            ${arbitrarySwapFee.toFixed(2)}
          </Text>
        </StyledDivForFee>
        <Button
          size="humongous"
          disabled={isLoading}
          onClick={isLoading ? undefined : (mutateTransferAsset as () => void)}
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
`

const StyledDivForFee = styled.div`
  display: flex;
  align-items: center;
  padding: 18px 0;
`
