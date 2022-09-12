import {
  ArrowUpIcon,
  Button,
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
    <Inline
      tabIndex={0}
      role="button"
      css={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <Column>
        <Text variant={'primary'} color="body" css={{ padding: '$16 0 $10' }}>
          Pooling rewards
        </Text>
        <Column
          css={{
            '-webkit-background-clip': 'text',
            '-webkit-text-fill-color': 'transparent',
            backgroundImage:
              'linear-gradient(140.55deg, #FE9C9E 1.35%, #FA2995 5.1%, #EA1EE9 10.37%, #287CF4 58.83%, #4CA7F2 75.84%, #31DAE2 99.52%)',
          }}
        >
          <Text variant="hero">+ ${rewardsDollarValue}</Text>
          <Text variant="link" css={{ paddingTop: '$2' }}>
            {pendingRewards?.length
              ? `Spread in ${pendingRewards.length} tokens`
              : ''}
          </Text>
        </Column>
      </Column>
      <Inline
        justifyContent="space-between"
        css={{
          padding: '$8 0 $12',
          flexWrap: 'wrap',
          width: '100%',
        }}
      >
        <Inline gap={14} css={{ margin: '$4 0', flexWrap: 'wrap' }}>
          {pendingRewardsRenderedInline?.map(({ tokenInfo, tokenAmount }) => (
            <UnderlyingAssetRow
              key={tokenInfo?.symbol}
              tokenInfo={tokenInfo}
              symbolVisible={false}
              tokenAmount={tokenAmount}
            />
          ))}
          {Boolean(pendingRewardsRenderedInTooltip?.length) && (
            <AdditionalUnderlyingAssetsRow
              assets={pendingRewardsRenderedInTooltip}
            />
          )}
        </Inline>
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
          state={receivedRewards ? cardInteractionState : undefined}
          variant="primary"
          size="large"
          ref={refForCard}
          disabled={!receivedRewards || loading}
          css={{ margin: '$4 0' }}
        >
          {loading ? 'Pending...' : 'Claim rewards'}
        </Button>
      </Inline>
    </Inline>
  )
}
