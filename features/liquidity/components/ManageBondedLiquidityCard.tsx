import { Button, Card, CardContent, Column, Inline, Text } from 'components'
import { useSubscribeInteractions } from 'hooks/useSubscribeInteractions'
import {
  dollarValueFormatter,
  dollarValueFormatterWithDecimals,
} from 'util/conversion'

import { AprPill } from './AprPill'
import { BaseCardForEmptyState } from './BaseCardForEmptyState'
import { SegmentedRewardsSimulator } from './SegmentedRewardsSimulator'

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
