import { Button, Card, CardContent, Column, Inline, Text } from 'components'
import { useSubscribeInteractions } from 'hooks/useSubscribeInteractions'
import { useMemo } from 'react'
import { dollarValueFormatterWithDecimals } from 'util/conversion'

import { AdditionalUnderlyingAssetsRow } from './AdditionalUnderlyingAssetsRow'
import { BaseCardForEmptyState } from './BaseCardForEmptyState'
import { UnderlyingAssetRow } from './UnderlyingAssetRow'

export const LiquidityRewardsCard = ({
  pendingRewards,
  hasProvidedLiquidity,
  hasBondedLiquidity,
  onClick,
  loading,
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
      if (!pendingRewards || pendingRewards.length <= 4) {
        return [pendingRewards, undefined]
      }
      return [pendingRewards.slice(0, 3), pendingRewards.slice(3)]
    }, [pendingRewards])

  if (!hasBondedLiquidity) {
    return (
      <BaseCardForEmptyState pointerVisible={hasProvidedLiquidity}>
        <Column align="center" css={{ paddingTop: '$16' }}>
          <Text
            align="center"
            variant="body"
            color="tertiary"
            css={{ padding: '$15 0 $6' }}
          >
            No rewards rendered yet
          </Text>
          <Text align="center" variant="primary">
            Stake your token to start earning 158% APR
          </Text>
        </Column>
      </BaseCardForEmptyState>
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
