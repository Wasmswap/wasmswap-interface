import { useTokenToTokenPrice } from 'features/swap'
import {
  Button,
  ChevronIcon,
  Column,
  Divider,
  dollarValueFormatter,
  ImageForTokenLogo,
  InfoIcon,
  Inline,
  Text,
  Tooltip,
} from 'junoblocks'
import React from 'react'
import {
  __POOL_REWARDS_ENABLED__,
  __POOL_STAKING_ENABLED__,
} from 'util/constants'

import { SerializedRewardsContract } from '../../../queries/queryRewardsContracts'
import { TokenInfo } from '../../../queries/usePoolsListQuery'
import { PoolTokenValue } from '../../../queries/useQueryPools'
import { formatCompactNumber } from '../../../util/formatCompactNumber'
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
  lpFee?: number
  protocolFee?: number
}

type PoolHeaderProps = {
  tokenA: TokenInfo
  tokenB: TokenInfo
  priceBreakdown: string
}

const PoolHeader = ({ tokenA, tokenB, priceBreakdown }: PoolHeaderProps) => (
  <Inline justifyContent="space-between" css={{ padding: '$16 0 $14' }}>
    <Inline gap={6}>
      <Text variant="header">All Pools</Text>
      <ChevronIcon rotation="180deg" css={{ color: '$colors$dark' }} />

      <Inline gap={8}>
        <Inline gap={3}>
          <ImageForTokenLogo
            size="large"
            logoURI={tokenA.logoURI}
            alt={tokenA.symbol}
          />
          <Text variant="link">{tokenA.symbol}</Text>
        </Inline>
        <Inline gap={3}>
          <ImageForTokenLogo
            size="large"
            logoURI={tokenB.logoURI}
            alt={tokenB.symbol}
          />
          <Text variant="link">{tokenB.symbol}</Text>
        </Inline>
      </Inline>
    </Inline>
    <Text variant="legend" color="secondary" transform="lowercase">
      {priceBreakdown}
    </Text>
  </Inline>
)

const SwapFee = ({
  protocolFee = 0,
  lpFee = 0.3,
}: {
  protocolFee?: number
  lpFee?: number
}) => (
  <>
    <Text variant="header">{`${protocolFee + lpFee}%`}</Text>
    <Tooltip
      label={`${lpFee}% of Swap Fee goes to LP Providers (LP) and ${protocolFee}% goes to Raw DAO`}
    >
      <Button variant="ghost" size="small" icon={<InfoIcon />} />
    </Tooltip>
  </>
)

export const LiquidityBreakdown = ({
  tokenA,
  tokenB,
  poolId,
  totalLiquidity,
  yieldPercentageReturn,
  rewardsContracts,
  lpFee,
  protocolFee,
  size = 'large',
}: LiquidityBreakdownProps) => {
  const [{ price: tokenPrice }, isPriceLoading] = useTokenToTokenPrice({
    tokenASymbol: tokenA?.symbol,
    tokenBSymbol: tokenB?.symbol,
    tokenAmount: 1,
  })

  const [tokenAAmount] = usePoolPairTokenAmount({
    tokenAmountInMicroDenom: totalLiquidity?.tokenAmount ?? 0,
    tokenPairIndex: 0,
    poolId,
  })

  const [tokenBAmount] = usePoolPairTokenAmount({
    tokenAmountInMicroDenom: totalLiquidity?.tokenAmount ?? 0,
    tokenPairIndex: 1,
    poolId,
  })

  const compactTokenAAmount = formatCompactNumber(tokenAAmount, 'tokenAmount')
  const compactTokenBAmount = formatCompactNumber(tokenBAmount, 'tokenAmount')

  const formattedTotalLiquidity = formatCompactNumber(
    totalLiquidity?.dollarValue
  )

  const formattedYieldPercentageReturn = dollarValueFormatter(
    yieldPercentageReturn ?? 0
  )

  const priceBreakdown = isPriceLoading
    ? ''
    : `1 ${tokenA.symbol} = ${tokenPrice} ${tokenB.symbol}`

  if (size === 'small') {
    return (
      <>
        <PoolHeader
          tokenA={tokenA}
          tokenB={tokenB}
          priceBreakdown={priceBreakdown}
        />
        <Inline
          css={{
            backgroundColor: '$colors$dark10',
            borderRadius: '$2',
            marginBottom: '$14',
          }}
        >
          <Column
            justifyContent="space-between"
            css={{ padding: '$10 $16', width: '100%' }}
          >
            <Inline justifyContent={'space-between'} align="center">
              <Column gap={6} align="flex-start" justifyContent="flex-start">
                <Text variant="legend" color="secondary" align="left">
                  Total liquidity
                </Text>
                <Text variant="header">${formattedTotalLiquidity}</Text>
              </Column>

              <Column gap={8} align="flex-start" justifyContent="flex-start">
                <Text variant="legend" color="secondary" align="left">
                  {tokenA?.symbol}
                </Text>
                <Inline gap={2}>
                  <Text variant="header">{compactTokenAAmount}</Text>
                </Inline>
              </Column>
              <Column gap={8} align="flex-start" justifyContent="flex-start">
                <Text variant="legend" color="secondary" align="left">
                  {tokenB?.symbol}
                </Text>
                <Inline gap={2}>
                  <Text variant="header">{compactTokenBAmount}</Text>
                </Inline>
              </Column>
            </Inline>
            <Column css={{ padding: '$8 0' }}>
              <Divider />
            </Column>
            <Inline justifyContent={'space-between'} align="center">
              <Column gap={4} align="flex-start" justifyContent="space-between">
                <Text variant="legend" color="secondary" align="right">
                  Bonding Reward
                </Text>
                <AprPill value={formattedYieldPercentageReturn} />
              </Column>
              <Column gap={4} align="flex-start" justifyContent="flex-start">
                <Text variant="legend" color="secondary" align="left">
                  Swap Fee
                </Text>

                <Inline gap={2}>
                  <SwapFee lpFee={lpFee} protocolFee={protocolFee} />
                </Inline>
              </Column>
              {__POOL_REWARDS_ENABLED__ &&
                rewardsContracts &&
                rewardsContracts.length > 0 && (
                  <Column gap={6} align="center">
                    <Text variant="legend" color="secondary">
                      Reward Tokens
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
            </Inline>
          </Column>
        </Inline>
      </>
    )
  }

  return (
    <>
      <PoolHeader
        tokenA={tokenA}
        tokenB={tokenB}
        priceBreakdown={priceBreakdown}
      />
      <>
        <TotalInfoRow>
          <Column gap={8} align="flex-start" justifyContent="flex-start">
            <Text variant="legend" color="secondary" align="left">
              Pool Liquidity
            </Text>
            <Inline gap={2}>
              <Text variant="header">${formattedTotalLiquidity} </Text>
            </Inline>
          </Column>

          <Column gap={8} align="flex-start" justifyContent="flex-start">
            <Text variant="legend" color="secondary" align="left">
              {tokenA?.symbol}
            </Text>
            <Inline gap={2}>
              <Text variant="header">{compactTokenAAmount}</Text>
            </Inline>
          </Column>

          <Column gap={8} align="flex-start" justifyContent="flex-start">
            <Text variant="legend" color="secondary" align="left">
              {tokenB?.symbol}
            </Text>
            <Inline gap={2}>
              <Text variant="header">{compactTokenBAmount}</Text>
            </Inline>
          </Column>
          <Column gap={8} align="flex-start" justifyContent="flex-start">
            <Text variant="legend" color="secondary" align="left">
              Swap Fee
            </Text>

            <Inline gap={2}>
              <SwapFee lpFee={lpFee} protocolFee={protocolFee} />
            </Inline>
          </Column>

          <Column gap={4} align="center" justifyContent="space-between">
            <Text variant="legend" color="secondary" align="right">
              Bonding Reward
            </Text>
            <AprPill value={formattedYieldPercentageReturn} />
          </Column>
          {__POOL_REWARDS_ENABLED__ &&
            rewardsContracts &&
            rewardsContracts.length > 0 && (
              <Column gap={8} align="center" justifyContent="center">
                <Text variant="legend" color="secondary" align="center">
                  Reward Tokens
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
        </TotalInfoRow>
      </>
    </>
  )
}

function TotalInfoRow({ children }) {
  const baseCss = { padding: '$10 $16' }

  if (__POOL_STAKING_ENABLED__ && __POOL_REWARDS_ENABLED__) {
    return (
      <Inline
        css={{
          ...baseCss,
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: '$colors$dark10',
          borderRadius: '$2',
          marginBottom: '$14',
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
