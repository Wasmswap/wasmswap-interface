import {
  Text,
  Divider,
  Button,
  CardContent,
  Card,
  Inline,
  Column,
  ImageForTokenLogo,
} from 'components'
import {
  dollarValueFormatter,
  dollarValueFormatterWithDecimals,
  protectAgainstNaN,
} from 'util/conversion'
import { StyledDivForTokenLogos } from './PoolCard'
import { AprPill } from './AprPill'
import { BaseCardForEmptyState } from './BaseCardForEmptyState'
import { useSubscribeInteractions } from 'hooks/useSubscribeInteractions'

export const ManageBondedLiquidityCard = ({
  onClick,
  rewardsContracts,
  rewardsInfo,
  myLiquidity,
  stakedBalance,
  supportsIncentives,
}) => {
  const [refForCard, cardInteractionState] = useSubscribeInteractions()

  const bondedLiquidity = supportsIncentives && stakedBalance?.tokenAmount > 0
  const providedLiquidity = myLiquidity?.tokenAmount > 0

  const unstakedLiquidityDollarValue = dollarValueFormatterWithDecimals(
    myLiquidity?.dollarValue,
    {
      includeCommaSeparation: true,
    }
  )

  const bondedLiquidityDollarValue = dollarValueFormatterWithDecimals(
    stakedBalance?.dollarValue,
    {
      includeCommaSeparation: true,
    }
  )

  const formattedYieldPercentageReturn = dollarValueFormatter(
    rewardsInfo?.yieldPercentageReturn ?? 0
  )
  const interestOnStakedBalance =
    (rewardsInfo?.yieldPercentageReturn ?? 0) / 100
  const rewardsOnStakedTokensPerWeek = protectAgainstNaN(
    (stakedBalance?.dollarValue * interestOnStakedBalance) / 52.1429
  )

  if (!providedLiquidity && !bondedLiquidity) {
    return (
      <BaseCardForEmptyState>
        <Column align="center">
          <AprPill value="158" />
          <Text
            align="center"
            variant="body"
            color="tertiary"
            css={{ padding: '$15 0 $6' }}
          >
            No staked liquidity yet
          </Text>
          <Text align="center" variant="primary">
            Add liquidity to the pool so you can stake it
          </Text>
        </Column>
      </BaseCardForEmptyState>
    )
  }

  return (
    <Card
      ref={refForCard}
      onClick={supportsIncentives ? onClick : undefined}
      variant={bondedLiquidity ? 'primary' : 'secondary'}
    >
      <CardContent>
        <Text variant="legend" color="brand" css={{ padding: '$16 0 $6' }}>
          Staked liquidity
        </Text>
        <Text variant="hero">${bondedLiquidityDollarValue}</Text>
        <Text variant="link" color="brand" css={{ paddingTop: '$4' }}>
          ${unstakedLiquidityDollarValue} unstaked
        </Text>
      </CardContent>
      <Divider offsetTop="$8" offsetBottom="$12" />
      <CardContent>
        <Text variant="legend" color="secondary" css={{ paddingBottom: '$6' }}>
          Liquidity incentives
        </Text>
        <Inline gap={12}>
          <AprPill value={formattedYieldPercentageReturn} />

          <Inline gap={6}>
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
            <Text variant="link">
              $
              {dollarValueFormatter(rewardsOnStakedTokensPerWeek, {
                includeCommaSeparation: true,
              })}
              /week
            </Text>
          </Inline>
        </Inline>
        <Inline css={{ padding: '$18 0 $13' }}>
          {bondedLiquidity && (
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onClick?.()
              }}
              state={supportsIncentives ? cardInteractionState : undefined}
              variant="secondary"
              size="large"
              disabled={!supportsIncentives}
              css={{ width: '100%' }}
            >
              {supportsIncentives
                ? 'Manage Staking'
                : 'Does not support staking'}
            </Button>
          )}
          {!bondedLiquidity && (
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onClick?.()
              }}
              state={supportsIncentives ? cardInteractionState : undefined}
              variant="primary"
              size="large"
              css={{ width: '100%' }}
              disabled={!supportsIncentives}
            >
              {supportsIncentives
                ? 'Stake liquidity'
                : 'Does not support staking'}
            </Button>
          )}
        </Inline>
      </CardContent>
    </Card>
  )
}
