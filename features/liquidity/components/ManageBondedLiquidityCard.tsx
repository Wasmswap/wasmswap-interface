import {
  ArrowUpIcon,
  Button,
  Card,
  CardContent,
  Column,
  dollarValueFormatter,
  dollarValueFormatterWithDecimals,
  Inline,
  Text,
  UnionIcon,
  useSubscribeInteractions,
} from 'junoblocks'

import { BaseCardForEmptyState } from './BaseCardForEmptyState'
import { SegmentedRewardsSimulator } from './SegmentedRewardsSimulator'
import { StepIcon } from './StepIcon'

export const ManageBondedLiquidityCard = ({
  onClick,
  rewardsInfo,
  myLiquidity,
  stakedBalance,
  supportsIncentives,
}) => {
  const [refForCard, cardInteractionState] = useSubscribeInteractions()

  const bondedLiquidity = supportsIncentives && stakedBalance?.tokenAmount > 0
  const providedLiquidity = myLiquidity?.tokenAmount > 0

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

  if (!supportsIncentives) {
    return (
      <BaseCardForEmptyState
        variant="secondary"
        disabled={true}
        content={
          <Column align="center">
            <UnionIcon color="error" />
            <Text
              align="center"
              variant="body"
              color="tertiary"
              css={{ padding: '$15 0 $6' }}
            >
              Incentives are not supported for this token, yet.
            </Text>
          </Column>
        }
        footer={
          <Text align="center" variant="link" color="disabled">
            Come back later
          </Text>
        }
      />
    )
  }

  if (!providedLiquidity && !bondedLiquidity) {
    return (
      <BaseCardForEmptyState
        variant="ghost"
        disabled={true}
        content={
          <Column align="center">
            <StepIcon step={1} />
            <Text
              align="center"
              variant="body"
              color="tertiary"
              css={{ padding: '$15 0 $6' }}
            >
              Add liquidity to the pool so you can bond your tokens and enjoy
              the {formattedYieldPercentageReturn}% APR
            </Text>
          </Column>
        }
        footer={
          <Inline gap={3}>
            <ArrowUpIcon color="brand" rotation="-90deg" />
            <Text align="center" variant="link" color="brand">
              First, add the liquidity
            </Text>
          </Inline>
        }
      />
    )
  }

  return (
    <Card
      ref={refForCard}
      onClick={supportsIncentives ? onClick : undefined}
      variant={bondedLiquidity ? 'primary' : 'secondary'}
    >
      <CardContent>
        <Text variant="legend" color="body" css={{ padding: '$16 0 $6' }}>
          Staked liquidity
        </Text>
        <Text variant="hero">${bondedLiquidityDollarValue}</Text>
        <Text variant="link" color="tertiary" css={{ padding: '$2 0 $14' }}>
          Expected interest with {formattedYieldPercentageReturn}% APR
        </Text>

        <SegmentedRewardsSimulator
          interestOnStakedBalance={interestOnStakedBalance}
          stakedBalanceDollarValue={stakedBalance?.dollarValue}
        />

        <Inline css={{ paddingBottom: '$12' }}>
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
