import { Text } from 'components/Text'
import { Button } from 'components/Button'
import { useTokenInfo } from 'hooks/useTokenInfo'
import { Divider } from 'components/Divider'
import { dollarValueFormatterWithDecimals } from 'util/conversion'
import { CardContent, Card } from 'components/Card'
import { Inline } from 'components/Inline'
import { Column } from 'components/Column'
import { ImageForTokenLogo } from 'components/ImageForTokenLogo'
import { StyledDivForTokenLogos } from './PoolCard'
import { AprPill } from './AprPill'
import { BaseCardForEmptyState } from './BaseCardForEmptyState'
import { useSubscribeInteractions } from '../../../hooks/useSubscribeInteractions'

export const ManageBondedLiquidityCard = ({
  onClick,
  tokenASymbol,

  tokenBSymbol,
  myLiquidity,
  stakedBalance,
  supportsIncentives,
}) => {
  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

  const [refForCard, cardInteractionState] = useSubscribeInteractions()

  const bondedLiquidity = supportsIncentives && stakedBalance?.coins > 0
  const providedLiquidity = myLiquidity?.coins > 0

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

  if (!providedLiquidity) {
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
          Currently reward incentive
        </Text>
        <Inline gap={12}>
          <AprPill value="158" />

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
                ? 'Manage staking'
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
