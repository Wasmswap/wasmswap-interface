import { styled } from '@stitches/react'
import { Text } from '../../Text'
import { Button } from '../../Button'
import { formatTokenBalance } from '../../../util/conversion'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { slippageAtom, tokenSwapAtom } from '../swapAtoms'
import { walletState, WalletStatusType } from '../../../state/atoms/walletAtoms'
import { useConnectWallet } from '../../../hooks/useConnectWallet'
import { useTokenSwap } from '../hooks/useTokenSwap'
import { Spinner } from '../../Spinner'
import { SlippageSelector } from './SlippageSelector'
import { NETWORK_FEE } from '../../../util/constants'

type TransactionTipsProps = {
  isPriceLoading?: boolean
  tokenToTokenPrice?: number
}

export const TransactionAction = ({
  isPriceLoading,
  tokenToTokenPrice,
}: TransactionTipsProps) => {
  const [requestedSwap, setRequestedSwap] = useState(false)
  const [tokenA, tokenB] = useRecoilValue(tokenSwapAtom)

  /* wallet state */
  const { status } = useRecoilValue(walletState)
  const { mutate: connectWallet } = useConnectWallet()

  const [slippage, setSlippage] = useRecoilState(slippageAtom)

  const { mutate: handleSwap, isLoading: isExecutingTransaction } =
    useTokenSwap({
      tokenASymbol: tokenA?.tokenSymbol,
      tokenBSymbol: tokenB?.tokenSymbol,
      tokenAmount: tokenA?.amount,
      tokenToTokenPrice: tokenToTokenPrice || 0,
    })

  const handleSwapButtonClick = () => {
    if (status === WalletStatusType.connected) {
      return setRequestedSwap(true)
    }

    connectWallet(null)
  }

  /* proceed with the swap only if the price is loaded */
  useEffect(() => {
    const shouldTriggerTransaction =
      !isPriceLoading && !isExecutingTransaction && requestedSwap
    if (shouldTriggerTransaction) {
      handleSwap()
      setRequestedSwap(false)
    }
  }, [isPriceLoading, isExecutingTransaction, requestedSwap, handleSwap])

  return (
    <StyledDivForWrapper>
      <StyledDivForInfo>
        <StyledDivColumnForInfo kind="slippage">
          <SlippageSelector
            slippage={slippage}
            onSlippageChange={setSlippage}
          />
        </StyledDivColumnForInfo>
        <StyledDivColumnForInfo kind="fees">
          <Text type="microscopic" variant="bold" color="disabled">
            Swap fee ({NETWORK_FEE * 100}%)
          </Text>
        </StyledDivColumnForInfo>
      </StyledDivForInfo>
      <Button
        type={status === WalletStatusType.connected ? 'primary' : 'disabled'}
        disabled={
          isExecutingTransaction ||
          !tokenB.tokenSymbol ||
          !tokenA.tokenSymbol ||
          (status === WalletStatusType.connected && tokenA.amount <= 0)
        }
        onClick={
          !isExecutingTransaction && !isPriceLoading
            ? handleSwapButtonClick
            : undefined
        }
      >
        {isExecutingTransaction ? (
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
  gridTemplateColumns: '1fr 150px',
  columnGap: 12,
  alignItems: 'center',
  padding: '12px 0',
})

const StyledDivForInfo = styled('div', {
  display: 'flex',
  alignItems: 'center',
  textTransform: 'uppercase',
  borderRadius: 8,
})

const StyledDivColumnForInfo = styled('div', {
  display: 'grid',
  variants: {
    kind: {
      slippage: {
        backgroundColor: 'transparent',
        minWidth: '140px',
        borderRadius: '8px 0 0 8px',
        borderRight: '1px solid rgba(25, 29, 32, 0.2)',
      },
      fees: {
        backgroundColor: 'rgba(25, 29, 32, 0.1)',
        flex: 1,
        padding: '16px 25px',
        borderRadius: '0 8px 8px 0',
      },
    },
  },
})
