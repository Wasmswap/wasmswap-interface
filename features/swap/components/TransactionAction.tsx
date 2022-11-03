import { useConnectWallet } from 'hooks/useConnectWallet'
import { useTokenBalance } from 'hooks/useTokenBalance'
import { Button, Inline, Spinner, styled, Text } from 'junoblocks'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { walletState, WalletStatusType } from 'state/atoms/walletAtoms'

import { useTokenSwap, useSwapFee } from '../hooks'
import { slippageAtom, tokenSwapAtom } from '../swapAtoms'
import { SlippageSelector } from './SlippageSelector'

type TransactionTipsProps = {
  isPriceLoading?: boolean
  tokenToTokenPrice?: number
  size?: 'small' | 'large'
}

export const TransactionAction = ({
  isPriceLoading,
  size = 'large',
}: TransactionTipsProps) => {
  const [requestedSwap, setRequestedSwap] = useState(false)
  const [tokenA, tokenB] = useRecoilValue(tokenSwapAtom)
  const { balance: tokenABalance } = useTokenBalance(tokenA?.tokenSymbol)

  /* wallet state */
  const { status } = useRecoilValue(walletState)
  const { mutate: connectWallet } = useConnectWallet()
  const [slippage, setSlippage] = useRecoilState(slippageAtom)

  const { mutate: handleSwap, isLoading: isExecutingTransaction } =
    useTokenSwap({
      tokenASymbol: tokenA?.tokenSymbol,
      tokenBSymbol: tokenB?.tokenSymbol,
      tokenAmount: tokenA?.amount,
    })

  /* proceed with the swap only if the price is loaded */
  useEffect(() => {
    const shouldTriggerTransaction =
      !isPriceLoading && !isExecutingTransaction && requestedSwap
    if (shouldTriggerTransaction) {
      handleSwap(undefined, { onSettled: () => setRequestedSwap(false) })
    }
  }, [isPriceLoading, isExecutingTransaction, requestedSwap, handleSwap])

  const handleSwapButtonClick = () => {
    if (status === WalletStatusType.connected) {
      return setRequestedSwap(true)
    }

    connectWallet(null)
  }

  const shouldDisableSubmissionButton =
    isExecutingTransaction ||
    !tokenB.tokenSymbol ||
    !tokenA.tokenSymbol ||
    status !== WalletStatusType.connected ||
    tokenA.amount <= 0 ||
    tokenA?.amount > tokenABalance

  const swapFee = useSwapFee({ tokenA, tokenB })

  if (size === 'small') {
    return (
      <>
        <Inline css={{ display: 'grid', padding: '$6 0' }}>
          <SlippageSelector
            slippage={slippage}
            onSlippageChange={setSlippage}
            css={{ width: '100%' }}
          />
        </Inline>
        <Inline
          justifyContent="space-between"
          css={{
            padding: '$8 $12',
            backgroundColor: '$colors$dark10',
            borderRadius: '$1',
          }}
        >
          <Text variant="legend" transform="uppercase">
            Swap fee
          </Text>
          <Text variant="legend">{swapFee}%</Text>
        </Inline>
        <Inline css={{ display: 'grid', paddingTop: '$8' }}>
          <Button
            variant="primary"
            size="large"
            disabled={shouldDisableSubmissionButton}
            onClick={
              !isExecutingTransaction && !isPriceLoading
                ? handleSwapButtonClick
                : undefined
            }
          >
            {isExecutingTransaction ? <Spinner instant /> : 'Swap'}
          </Button>
        </Inline>
      </>
    )
  }

  return (
    <StyledDivForWrapper>
      <StyledDivForInfo>
        <StyledDivColumnForInfo kind="slippage">
          <SlippageSelector
            slippage={slippage}
            onSlippageChange={setSlippage}
            css={{ borderRadius: '$2 0 0 $2' }}
          />
        </StyledDivColumnForInfo>
        <StyledDivColumnForInfo kind="fees">
          <Text variant="legend">Swap fee ({swapFee}%)</Text>
        </StyledDivColumnForInfo>
      </StyledDivForInfo>
      <Button
        variant="primary"
        size="large"
        disabled={shouldDisableSubmissionButton}
        onClick={
          !isExecutingTransaction && !isPriceLoading
            ? handleSwapButtonClick
            : undefined
        }
      >
        {isExecutingTransaction ? <Spinner instant /> : 'Swap'}
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
        borderRadius: '$4 0 0 $4',
        borderRight: '1px solid $borderColors$default',
      },
      fees: {
        backgroundColor: '$colors$dark10',
        flex: 1,
        padding: '$space$8 $space$12',
        borderRadius: '0 $2 $2 0',
      },
    },
  },
})
