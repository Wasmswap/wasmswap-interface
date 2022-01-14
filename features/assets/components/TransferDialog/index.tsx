import styled from 'styled-components'
import { toast } from 'react-hot-toast'
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
import { Toast } from '../../../../components/Toast'
import { IconWrapper } from '../../../../components/IconWrapper'
import { Valid } from '../../../../icons/Valid'
import { Error } from '../../../../icons/Error'
import { UpRightArrow } from '../../../../icons/UpRightArrow'

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

      toast.custom((t) => (
        <Toast
          icon={<IconWrapper icon={<Valid />} color="valid" />}
          title={`${
            transactionKind === 'deposit' ? 'Deposited' : 'Withdrawn'
          } ${tokenInfo.name} Successfully`}
          onClose={() => toast.dismiss(t.id)}
        />
      ))

      // close modal
      requestAnimationFrame(onRequestClose)
    },
    onError(error) {
      toast.custom((t) => (
        <Toast
          icon={<IconWrapper icon={<Error />} color="error" />}
          title={`Couldn't ${
            transactionKind === 'deposit' ? 'Deposit' : 'Withdraw'
          } the asset`}
          body={(error as any)?.message ?? error?.toString()}
          buttons={
            <Button
              as="a"
              variant="ghost"
              href={process.env.NEXT_PUBLIC_FEEDBACK_LINK}
              target="__blank"
              iconRight={<UpRightArrow />}
            >
              Provide feedback
            </Button>
          }
          onClose={() => toast.dismiss(t.id)}
        />
      ))
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
