import { useTokenToTokenPrice } from 'features/swap'
import {
  Column,
  Divider,
  dollarValueFormatter,
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
  ImageForTokenLogo,
  Inline,
  Text,
} from 'junoblocks'
import React from 'react'
import {
  __POOL_REWARDS_ENABLED__,
  __POOL_STAKING_ENABLED__,
} from 'util/constants'

import { SerializedRewardsContract } from '../../../queries/queryRewardsContracts'
import { TokenInfo } from '../../../queries/usePoolsListQuery'
import { PoolTokenValue } from '../../../queries/useQueryPools'
import { usePoolPairTokenAmount } from '../hooks'
import { AprPill } from './AprPill'
import { StyledDivForTokenLogos } from './PoolCard'

type LiquidityBreakdownProps = {
  tokenA: TokenInfo
  tokenB: TokenInfo
  poolId: string
  totalLiquidity: PoolTokenValue
  yieldPercentageReturn: number
  rewardsContracts: Array<SerializedRewardsContract>
  size: 'large' | 'small'
}

export const LiquidityBreakdown = ({
  tokenA,
  tokenB,
  poolId,
  totalLiquidity,
  yieldPercentageReturn,
  rewardsContracts,
  size = 'large',
}: LiquidityBreakdownProps) => {
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
    yieldPercentageReturn ?? 0
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
        {__POOL_REWARDS_ENABLED__ && (
          <Column gap={6} css={{ paddingBottom: '$20' }}>
            <Text variant="legend" color="secondary">
              Token reward distribution
            </Text>
            <Inline gap={8}>
              {rewardsContracts?.map(({ tokenInfo }, key) => (
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
          <Text variant="primary">Pool #{poolId}</Text>
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
        <TotalInfoRow>
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

          {__POOL_REWARDS_ENABLED__ && (
            <Column gap={6} align="center" justifyContent="center">
              <Text variant="legend" color="secondary" align="center">
                Token reward
              </Text>
              <StyledDivForTokenLogos>
                {rewardsContracts?.map(({ tokenInfo }) => (
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
        </TotalInfoRow>
      </>
    </>
  )
}

function TotalInfoRow({ children }) {
  const baseCss = { padding: '$15 0 $18' }

  if (__POOL_STAKING_ENABLED__ && __POOL_REWARDS_ENABLED__) {
    return (
      <Inline
        css={{
          ...baseCss,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 0.75fr 0.75fr',
        }}
      >
        {children}
      </Inline>
    )
  }

  return (
    <Inline gap={8} justifyContent="space-between" css={baseCss}>
      {children}
    </Inline>
  )
}
