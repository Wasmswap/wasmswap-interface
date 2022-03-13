import React from 'react'
import { Inline, Column, Text, ImageForTokenLogo, Divider } from 'components'
import {
  dollarValueFormatter,
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
} from 'util/conversion'
import { StyledDivForTokenLogos } from './PoolCard'
import { useTokenToTokenPrice } from 'features/swap'
import { AprPill } from './AprPill'
import { usePoolPairTokenAmount } from '../hooks'
import { __POOL_STAKING_ENABLED__ } from 'util/constants'

export const LiquidityBreakdown = ({
  tokenA,
  tokenB,
  poolId,
  totalLiquidity,
  rewardsInfo,
  rewardsContracts,
  size = 'large',
}) => {
  const [tokenPrice, isPriceLoading] = useTokenToTokenPrice({
    tokenASymbol: tokenA?.symbol,
    tokenBSymbol: tokenB?.symbol,
    tokenAmount: 1,
  })

  const [tokenAAmount] = usePoolPairTokenAmount({
    tokenAmountInMicroDenom: (totalLiquidity?.tokenAmount ?? 0) / 2,
    tokenPairIndex: 0,
    poolId,
  })

  const [tokenBAmount] = usePoolPairTokenAmount({
    tokenAmountInMicroDenom: (totalLiquidity?.tokenAmount ?? 0) / 2,
    tokenPairIndex: 1,
    poolId,
  })

  const formattedYieldPercentageReturn = dollarValueFormatter(
    rewardsInfo?.yieldPercentageReturn ?? 0
  )

  const priceBreakdown = isPriceLoading
    ? ''
    : `1 ${tokenA.symbol} = ${tokenPrice} ${tokenB.symbol}`

  if (size === 'small') {
    return (
      <>
        <Inline justifyContent="space-between" css={{ paddingBottom: '$12' }}>
          <Inline gap={12}>
            {[tokenA, tokenB].map((token) => (
              <Inline gap={3} key={token.symbol}>
                <ImageForTokenLogo
                  size="large"
                  logoURI={token.logoURI}
                  alt={token.symbol}
                />
                <Text variant="link">{token.symbol}</Text>
              </Inline>
            ))}
          </Inline>
          <Text variant="legend" color="secondary" transform="lowercase">
            {priceBreakdown}
          </Text>
        </Inline>
        <Divider />
        <Inline justifyContent="space-between" css={{ padding: '$14 0 $12' }}>
          <Column gap={6} align="flex-start" justifyContent="flex-start">
            <Text variant="legend" color="secondary" align="left">
              Total liquidity
            </Text>
            <Text variant="header">
              $
              {dollarValueFormatterWithDecimals(totalLiquidity?.dollarValue, {
                includeCommaSeparation: true,
              })}
            </Text>
          </Column>
          <Column gap={6} align="flex-end" justifyContent="flex-end">
            <Text variant="legend" color="secondary" align="right">
              APR reward
            </Text>
            <Text variant="header">{formattedYieldPercentageReturn}%</Text>
          </Column>
        </Inline>
        {__POOL_STAKING_ENABLED__ && (
          <Column gap={6} css={{ paddingBottom: '$20' }}>
            <Text variant="legend" color="secondary">
              Token reward distribution
            </Text>
            <Inline gap={8}>
              {rewardsContracts?.contracts?.map(({ tokenInfo }, key) => (
                <Inline gap={3} key={key}>
                  <ImageForTokenLogo
                    size="large"
                    logoURI={tokenInfo.logoURI}
                    alt={tokenInfo.symbol}
                  />
                  <Text variant="link">33%</Text>
                </Inline>
              ))}
            </Inline>
          </Column>
        )}
      </>
    )
  }

  return (
    <>
      <Inline justifyContent="space-between" css={{ padding: '$8 0' }}>
        <Inline gap={18}>
          <Text variant="primary">Pool #{tokenB.pool_id}</Text>
          <Inline gap={12}>
            <Inline gap={6}>
              <ImageForTokenLogo
                size="large"
                logoURI={tokenA.logoURI}
                alt={tokenA.symbol}
              />
              <ImageForTokenLogo
                size="large"
                logoURI={tokenB.logoURI}
                alt={tokenB.symbol}
              />
            </Inline>
          </Inline>
        </Inline>
        <Text variant="legend" color="secondary" transform="lowercase">
          {priceBreakdown}
        </Text>
      </Inline>

      <Divider />

      <>
        <Inline
          css={{
            display: 'grid',
            gridTemplateColumns: __POOL_STAKING_ENABLED__
              ? '1fr 1fr 1fr 0.75fr 0.75fr'
              : '1fr 1fr',
            padding: '$15 0 $18',
          }}
        >
          <Column gap={6} align="flex-start" justifyContent="flex-start">
            <Text variant="legend" color="secondary" align="left">
              Total liquidity
            </Text>
            <Text variant="header">
              $
              {dollarValueFormatterWithDecimals(totalLiquidity?.dollarValue, {
                includeCommaSeparation: true,
              })}
            </Text>
          </Column>

          <Column gap={6} align="flex-start" justifyContent="flex-start">
            <Text variant="legend" color="secondary" align="left">
              {tokenA?.symbol}
            </Text>
            <Text variant="header">{formatTokenBalance(tokenAAmount)}</Text>
          </Column>

          <Column gap={6} align="flex-start" justifyContent="flex-start">
            <Text variant="legend" color="secondary" align="left">
              {tokenB?.symbol}
            </Text>
            <Text variant="header">{formatTokenBalance(tokenBAmount)}</Text>
          </Column>

          {__POOL_STAKING_ENABLED__ && (
            <Column gap={6} align="center" justifyContent="center">
              <Text variant="legend" color="secondary" align="center">
                Token reward
              </Text>
              <StyledDivForTokenLogos>
                {rewardsContracts?.contracts.map(({ tokenInfo }) => (
                  <ImageForTokenLogo
                    size="large"
                    key={tokenInfo.symbol}
                    logoURI={tokenInfo.logoURI}
                    alt={tokenInfo.symbol}
                  />
                ))}
              </StyledDivForTokenLogos>
            </Column>
          )}

          <Column gap={6} align="flex-end" justifyContent="flex-end">
            <Text variant="legend" color="secondary" align="right">
              APR reward
            </Text>
            <AprPill value={formattedYieldPercentageReturn} />
          </Column>
        </Inline>
      </>
    </>
  )
}
