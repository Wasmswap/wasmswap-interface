import { styled } from '@stitches/react'
import { Text } from '../Text'
import { Button } from '../Button'
import { formatTokenBalance } from '../../util/conversion'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { tokenSwapAtom } from './tokenSwapAtom'
import { walletState, WalletStatusType } from '../../state/atoms/walletAtoms'
import { useConnectWallet } from '../../hooks/useConnectWallet'
import { useTokenSwap } from './useTokenSwap'
import { transactionStatusState } from '../../state/atoms/transactionAtoms'
import { Spinner } from '../Spinner'

type TransactionTipsProps = {
  tokenAPrice?: number
  tokenBPrice?: number
  tokenToTokenPrice?: number
}

export const TransactionAction = ({
  tokenAPrice,
  tokenBPrice,
  tokenToTokenPrice,
}: TransactionTipsProps) => {
  const { status } = useRecoilValue(walletState)
  const transactionStatus = useRecoilValue(transactionStatusState)
  const [tokenA, tokenB] = useRecoilValue(tokenSwapAtom)

  const { mutate: connectWallet } = useConnectWallet()

  const handleSwap = useTokenSwap({
    tokenASymbol: tokenA?.tokenSymbol,
    tokenBSymbol: tokenB?.tokenSymbol,
    tokenAmount: tokenA?.amount,
    tokenToTokenPrice,
  })

  const handleSwapButtonClick = () => {
    if (status === WalletStatusType.connected) {
      return handleSwap()
    }

    connectWallet(null)
  }

  return (
    <StyledDivForWrapper>
      <StyledDivForInfo>
        <Text type="microscopic" variant="bold" color="disabled" font="mono">
          RATE
        </Text>
        <Text type="microscopic" variant="bold" color="disabled" font="mono">
          <>
            {typeof tokenAPrice === 'number' &&
              typeof tokenBPrice === 'number' && (
                <>
                  1 {tokenA.tokenSymbol} ={' '}
                  {formatTokenBalance(tokenAPrice / tokenBPrice)}{' '}
                  {tokenB.tokenSymbol}
                </>
              )}
          </>
        </Text>
      </StyledDivForInfo>
      <Button
        disabled={
          status !== WalletStatusType.connected ||
          transactionStatus === 'EXECUTING_SWAP' ||
          !tokenB.tokenSymbol ||
          !tokenA.tokenSymbol ||
          tokenA.amount <= 0
        }
        onClick={
          transactionStatus !== 'EXECUTING_SWAP'
            ? handleSwapButtonClick
            : undefined
        }
      >
        {transactionStatus === 'EXECUTING_SWAP' ? (
          <Spinner />
        ) : (
          <Text type="subtitle" color="white" variant="light" paddingY="3px">
            {status === WalletStatusType.connected
              ? 'Swap tokens'
              : 'Connect wallet'}
          </Text>
        )}
      </Button>
    </StyledDivForWrapper>
  )
}

const StyledDivForWrapper = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 184px',
  columnGap: 12,
  alignItems: 'center',
  padding: '12px 0',
})

const StyledDivForInfo = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgba(25, 29, 32, 0.05)',
  padding: '16px 18px',
  textTransform: 'uppercase',
  borderRadius: 8,
})
