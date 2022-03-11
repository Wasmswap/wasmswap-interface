import { BaseCardForEmptyState } from './BaseCardForEmptyState'
import { Column } from 'components/Column'
import { Text } from 'components/Text'
import { CardContent, Card } from 'components/Card'
import { Inline } from 'components/Inline'
import { StyledDivForTokenLogos } from './PoolCard'
import { Button } from 'components/Button'
import { Divider } from 'components/Divider'
import { ImageForTokenLogo } from 'components/ImageForTokenLogo'
import { useTokenInfo } from 'hooks/useTokenInfo'
import { useSubscribeInteractions } from 'hooks/useSubscribeInteractions'
import { dollarValueFormatterWithDecimals } from 'util/conversion'
import { Spinner } from '../../../components/Spinner'
import { useMemo } from 'react'

export const LiquidityRewardsCard = ({
  pendingRewards,
  hasProvidedLiquidity,
  hasBondedLiquidity,
  onClick,
  tokenASymbol,
  tokenBSymbol,
  loading,
}) => {
  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

  const [refForCard, cardInteractionState] = useSubscribeInteractions()

  const pendingRewardsDollarValue = useMemo(() => {
    return (
      pendingRewards?.reduce(
        (value, item) => item?.dollarValue ?? 0 + value,
        0
      ) ?? 0
    )
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

  const rewardsDollarValue = dollarValueFormatterWithDecimals(
    pendingRewardsDollarValue,
    {
      includeCommaSeparation: true,
    }
  )

  const receivedRewards = pendingRewardsDollarValue > 0

  return (
    <Card
      ref={refForCard}
      tabIndex={0}
      role="button"
      onClick={receivedRewards ? onClick : undefined}
      variant="primary"
    >
      <CardContent>
        <Text variant="legend" color="brand" css={{ padding: '$16 0 $6' }}>
          Liquidity rewards
        </Text>
        <Text variant="hero" color="brand">
          ${rewardsDollarValue}
        </Text>
        <Text variant="link" color="brand" css={{ paddingTop: '$4' }}>
          Spread in 4 tokens
        </Text>
      </CardContent>
      <Divider offsetTop="$8" offsetBottom="$12" />
      <CardContent>
        <Text variant="legend" color="secondary" css={{ paddingBottom: '$8' }}>
          Rewards breakdown
        </Text>
        <Inline gap={6}>
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
          <Text variant="link">$105/days</Text>
        </Inline>
        <Inline css={{ padding: '$19 0 $13' }}>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              onClick?.()
            }}
            state={receivedRewards ? cardInteractionState : undefined}
            variant="primary"
            size="large"
            css={{ width: '100%' }}
            disabled={!receivedRewards}
            iconRight={loading && <Spinner />}
          >
            Claim your rewards
          </Button>
        </Inline>
      </CardContent>
    </Card>
  )
}
