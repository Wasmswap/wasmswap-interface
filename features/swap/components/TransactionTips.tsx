import {
  ArrowUpIcon,
  Button,
  Column,
  dollarValueFormatterWithDecimals,
  Exchange,
  formatTokenBalance,
  IconWrapper,
  Inline,
  styled,
  Text,
  Tooltip,
} from 'junoblocks'
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'

import { useTokenToTokenPrice, useTxRates } from '../hooks'
import { tokenSwapAtom } from '../swapAtoms'

type TransactionTipsProps = {
  onTokenSwaps: () => void
  disabled?: boolean
  size?: 'large' | 'small'
}

export const TransactionTips = ({
  onTokenSwaps,
  disabled,
  size = 'large',
}: TransactionTipsProps) => {
  const [swappedPosition, setSwappedPositions] = useState(false)
  const [tokenA, tokenB] = useRecoilValue(tokenSwapAtom)

  /* fetch token to token price */
  const [{ price: tokenToTokenPrice }, isPriceLoading] = useTokenToTokenPrice({
    tokenASymbol: tokenA?.tokenSymbol,
    tokenBSymbol: tokenB?.tokenSymbol,
    tokenAmount: tokenA?.amount || 1,
  })

  const {
    isShowing,
    conversionRate,
    conversionRateInDollar,
    tokenASwapValueUSD,
    tokenBSwapValueUSD,
  } = useTxRates({
    tokenASymbol: tokenA?.tokenSymbol,
    tokenBSymbol: tokenB?.tokenSymbol,
    tokenAAmount: tokenA?.amount || 1,
    tokenToTokenPrice,
    isLoading: isPriceLoading,
  })

  const switchTokensButton = (
    <Button
      icon={<StyledIconWrapper icon={<Exchange />} flipped={swappedPosition} />}
      variant="ghost"
      onClick={
        !disabled
          ? () => {
              setSwappedPositions(!swappedPosition)
              onTokenSwaps()
            }
          : undefined
      }
      iconColor="tertiary"
    />
  )

  const transactionRates = (
    <>
      1 {tokenA.tokenSymbol} ≈ {formatTokenBalance(conversionRate)}{' '}
      {tokenB.tokenSymbol}
      {' ≈ '}$
      {dollarValueFormatterWithDecimals(conversionRateInDollar, {
        includeCommaSeparation: true,
      })}
    </>
  )

  const priceImpact =
    (tokenBSwapValueUSD - tokenASwapValueUSD) / tokenASwapValueUSD
  const formattedPriceImpact = Math.abs(Math.round(priceImpact * 10000) / 100)
  const errorThreshold = priceImpact < -0.05

  const tokenAFormattedSwapValue = dollarValueFormatterWithDecimals(
    tokenASwapValueUSD,
    {
      includeCommaSeparation: true,
    }
  )
  const tokenBFormattedSwapValue = dollarValueFormatterWithDecimals(
    tokenBSwapValueUSD,
    {
      includeCommaSeparation: true,
    }
  )

  if (size === 'small') {
    return (
      <Inline
        justifyContent="space-between"
        css={{
          padding: isShowing ? '$10 $12 $10 $9' : '$11 $12 $11 $9',
          borderTop: '1px solid $borderColors$inactive',
          borderBottom: '1px solid $borderColors$inactive',
        }}
      >
        {switchTokensButton}
        {isShowing && (
          <Column align="flex-end" gap={2}>
            <Text variant="caption" color="disabled" wrap={false}>
              {transactionRates}
            </Text>
            <Text variant="caption" color="disabled" wrap={false}>
              Swap estimate: ${tokenBFormattedSwapValue}
            </Text>
          </Column>
        )}
      </Inline>
    )
  }

  return (
    <StyledDivForWrapper>
      <StyledDivForRateWrapper>
        {switchTokensButton}

        {isShowing && (
          <Text variant="legend" wrap={false}>
            {transactionRates}
          </Text>
        )}
      </StyledDivForRateWrapper>
      <Inline justifyContent={'flex-end'} gap={8} css={{ cursor: 'pointer' }}>
        <Tooltip label="Price impact due to the amount of liquity available in the pool.">
          <Inline
            css={{
              backgroundColor: errorThreshold
                ? '$backgroundColors$error'
                : '$backgroundColors$secondary',
              padding: '$2 $4 $2 $2',
              borderRadius: 4,
            }}
          >
            <ArrowUpIcon
              color={errorThreshold ? 'error' : 'secondary'}
              css={{
                transform: priceImpact < 0 ? 'rotate(180deg)' : undefined,
              }}
              size="medium"
            />
            <Text
              variant="legend"
              wrap={false}
              css={{
                color: errorThreshold
                  ? '$textColors$error'
                  : '$textColors$secondary',
              }}
            >
              {formattedPriceImpact}%
            </Text>
          </Inline>
        </Tooltip>
        <Column gap={4}>
          <Text variant="legend">${tokenAFormattedSwapValue}</Text>
          <Text variant="legend">${tokenBFormattedSwapValue}</Text>
        </Column>
      </Inline>
    </StyledDivForWrapper>
  )
}

const StyledDivForWrapper = styled('div', {
  padding: '$8 $16 $8 $12',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  justifyContent: 'space-between',
  alignItems: 'center',
  textAlign: 'right',
  borderTop: '1px solid $borderColors$inactive',
  borderBottom: '1px solid $borderColors$inactive',
})

const StyledDivForRateWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  textAlign: 'left',
  columnGap: '$space$6',
})

const StyledIconWrapper = styled(IconWrapper, {
  variants: {
    flipped: {
      true: {
        transform: 'rotateX(180deg)',
      },
      false: {
        transform: 'rotateX(0deg)',
      },
    },
  },
})
