import { Inline } from '../../../components/Inline'
import { __POOL_REWARDS_ENABLED__ } from '../../../util/constants'
import { Column } from '../../../components/Column'
import { Text } from '../../../components/Text'
import { dollarValueFormatterWithDecimals } from '../../../util/conversion'
import { StyledDivForTokenLogos } from './PoolCard'
import { ImageForTokenLogo } from '../../../components/ImageForTokenLogo'
import React from 'react'
import { Divider } from '../../../components/Divider'
import { useTokenToTokenPrice } from '../../swap/hooks/useTokenToTokenPrice'

export const LiquidityBreakdown = ({
  tokenA,
  tokenB,
  totalLiquidity,
  size = 'large',
}) => {
  const [tokenPrice, isPriceLoading] = useTokenToTokenPrice({
    tokenASymbol: tokenA?.symbol,
    tokenBSymbol: tokenB?.symbol,
    tokenAmount: 1,
  })

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
            <Text variant="header">0%</Text>
          </Column>
        </Inline>
        {__POOL_REWARDS_ENABLED__ && (
          <Column gap={6} css={{ paddingBottom: '$20' }}>
            <Text variant="legend" color="secondary">
              Token reward distribution
            </Text>
            <Inline gap={8}>
              {[tokenA, tokenB, tokenA, tokenB].map((token, key) => (
                <Inline gap={3} key={key}>
                  <ImageForTokenLogo
                    size="large"
                    logoURI={token.logoURI}
                    alt={token.symbol}
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
            gridTemplateColumns: __POOL_REWARDS_ENABLED__
              ? '1fr 1fr 1fr'
              : '1fr 1fr',
            padding: '$12 0 $16',
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

          {__POOL_REWARDS_ENABLED__ && (
            <Column gap={6} align="center" justifyContent="center">
              <Text variant="legend" color="secondary" align="center">
                Token reward
              </Text>
              <StyledDivForTokenLogos>
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
              </StyledDivForTokenLogos>
            </Column>
          )}

          <Column gap={6} align="flex-end" justifyContent="flex-end">
            <Text variant="legend" color="secondary" align="right">
              APR reward
            </Text>
            <Text variant="header">0%</Text>
          </Column>
        </Inline>
      </>
    </>
  )
}
