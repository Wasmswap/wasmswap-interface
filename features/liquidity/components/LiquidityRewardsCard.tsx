import {
  ArrowUpIcon,
  Button,
  Card,
  CardContent,
  Column,
  dollarValueFormatterWithDecimals,
  Inline,
  Text,
  UnionIcon,
  useSubscribeInteractions,
} from 'junoblocks'
import { useMemo } from 'react'

import { AdditionalUnderlyingAssetsRow } from './AdditionalUnderlyingAssetsRow'
import { BaseCardForEmptyState } from './BaseCardForEmptyState'
import { StepIcon } from './StepIcon'
import { UnderlyingAssetRow } from './UnderlyingAssetRow'

export const LiquidityRewardsCard = ({
  pendingRewards,
  hasProvidedLiquidity,
  hasBondedLiquidity,
  onClick,
  loading,
  supportsIncentives,
}) => {
  const [refForCard, cardInteractionState] = useSubscribeInteractions()

  const pendingRewardsDollarValue = useMemo(() => {
    return (
      pendingRewards?.reduce(
        (value, item) => (item?.dollarValue ?? 0) + value,
        0
      ) ?? 0
    )
  }, [pendingRewards])

  const [pendingRewardsRenderedInline, pendingRewardsRenderedInTooltip] =
    useMemo(() => {
      if (!pendingRewards || pendingRewards?.length <= 4) {
        return [pendingRewards || [], undefined]
      }
      return [pendingRewards.slice(0, 3), pendingRewards.slice(3)]
    }, [pendingRewards])

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
              Rewards are not supported for this token, yet.
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

  if (!hasBondedLiquidity && !pendingRewardsDollarValue) {
    return (
      <BaseCardForEmptyState
        variant="ghost"
        disabled={true}
        content={
          <Column align="center">
            <StepIcon step={hasProvidedLiquidity ? 1 : 2} />
            <Text
              align="center"
              variant="body"
              color="tertiary"
              css={{ padding: '$15 0 $6' }}
            >
              Bond your tokens and start collecting some pooling rewards.
              Rewards every 6 seconds.
            </Text>
          </Column>
        }
        footer={
          <Inline gap={3}>
            <ArrowUpIcon color="brand" rotation="-90deg" />
            <Text align="center" variant="link" color="brand">
              Then, bond your liquidity
            </Text>
          </Inline>
        }
      />
    )
  }

  const receivedRewards = pendingRewardsDollarValue > 0

  const rewardsDollarValue = dollarValueFormatterWithDecimals(
    pendingRewardsDollarValue,
    {
      includeCommaSeparation: true,
    }
  )

  return (
    <Card
      ref={refForCard}
      tabIndex={0}
      role="button"
      onClick={receivedRewards ? onClick : undefined}
      variant="primary"
      css={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardContent>
        <Text variant="legend" color="brand" css={{ padding: '$16 0 $6' }}>
          Liquidity rewards
        </Text>
        <Text variant="hero" color="brand">
          ${rewardsDollarValue}
        </Text>
        <Text variant="link" color="brand" css={{ paddingTop: '$2' }}>
          {pendingRewards?.length
            ? `Receive ${pendingRewards.length} tokens`
            : ''}
        </Text>
      </CardContent>
      <CardContent css={{ paddingTop: '$10' }}>
        <Column gap={6}>
          {new Array(4 - pendingRewardsRenderedInline.length)
            .fill(0)
            .map((_, index) => (
              <UnderlyingAssetRow visible={false} key={index} />
            ))}
          {pendingRewardsRenderedInline?.map(({ tokenInfo, tokenAmount }) => (
            <UnderlyingAssetRow
              key={tokenInfo.symbol}
              tokenSymbol={tokenInfo.symbol}
              tokenAmount={tokenAmount}
            />
          ))}
          {Boolean(pendingRewardsRenderedInTooltip?.length) && (
            <AdditionalUnderlyingAssetsRow
              assets={pendingRewardsRenderedInTooltip}
            />
          )}
        </Column>
        <Inline css={{ padding: '$16 0 $12' }}>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              onClick?.()
            }}
            state={receivedRewards ? cardInteractionState : undefined}
            variant="primary"
            size="large"
            css={{ width: '100%' }}
            disabled={!receivedRewards || loading}
          >
            {loading ? 'Pending...' : 'Claim your rewards'}
          </Button>
        </Inline>
      </CardContent>
    </Card>
  )
}
