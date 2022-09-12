import { useTokenInfo } from 'hooks/useTokenInfo'
import {
  Button,
  Card,
  CardContent,
  Column,
  convertMicroDenomToDenom,
  Divider,
  dollarValueFormatterWithDecimals,
  Inline,
  protectAgainstNaN,
  Text,
  useSubscribeInteractions,
} from 'junoblocks'
import { PoolState, PoolTokenValue, ReserveType } from 'queries/useQueryPools'

import { UnderlyingAssetRow } from './UnderlyingAssetRow'

type ManageLiquidityCardProps = {
  stakedLiquidity: PoolState
  providedLiquidity: PoolTokenValue
  providedTotalLiquidity: PoolTokenValue
  providedLiquidityReserve: ReserveType
  stakedLiquidityReserve: ReserveType
  onClick: () => void
  tokenASymbol: string
  tokenBSymbol: string
  supportsIncentives?: boolean
}

export const ManageLiquidityCard = ({
  onClick,
  providedLiquidityReserve,
  stakedLiquidityReserve,
  providedTotalLiquidity,
  providedLiquidity,
  stakedLiquidity,
  tokenASymbol,
  tokenBSymbol,
  supportsIncentives,
}: ManageLiquidityCardProps) => {
  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

  const [refForCard, cardInteractionState] = useSubscribeInteractions()

  const didBondLiquidity = stakedLiquidity?.provided.tokenAmount > 0
  const didProvideLiquidity =
    providedLiquidityReserve?.[0] > 0 || didBondLiquidity

  const tokenAReserve = convertMicroDenomToDenom(
    providedLiquidityReserve?.[0] + stakedLiquidityReserve?.[0],
    tokenA.decimals
  )

  const tokenBReserve = convertMicroDenomToDenom(
    providedLiquidityReserve?.[1] + stakedLiquidityReserve?.[1],
    tokenB.decimals
  )

  const providedLiquidityDollarValue = dollarValueFormatterWithDecimals(
    protectAgainstNaN(providedTotalLiquidity?.dollarValue) || '0.00',
    { includeCommaSeparation: true }
  )

  return (
    <Card
      ref={refForCard}
      tabIndex={-1}
      role="button"
      variant={
        didProvideLiquidity || didBondLiquidity ? 'primary' : 'secondary'
      }
      onClick={onClick}
    >
      <CardContent>
        <Text variant="legend" color="body" css={{ padding: '$16 0 $6' }}>
          Holdings
        </Text>
        <Text variant="hero">${providedLiquidityDollarValue}</Text>
        <Text variant="link" color="brand" css={{ paddingTop: '$2' }}>
          $
          {dollarValueFormatterWithDecimals(providedLiquidity?.dollarValue, {
            includeCommaSeparation: true,
          })}{' '}
          available
          {supportsIncentives ? ' to bond' : ''}
        </Text>
      </CardContent>
      <Divider offsetTop="$14" offsetBottom="$12" />
      <CardContent>
        <Text variant="legend" color="secondary" css={{ paddingBottom: '$12' }}>
          Underlying assets
        </Text>
        <Column gap={6} css={{ paddingBottom: '$16' }}>
          <UnderlyingAssetRow tokenInfo={tokenA} tokenAmount={tokenAReserve} />
          <UnderlyingAssetRow tokenInfo={tokenB} tokenAmount={tokenBReserve} />
        </Column>
        <Inline css={{ paddingBottom: '$12' }}>
          {didProvideLiquidity && (
            <Button
              variant="secondary"
              size="large"
              state={cardInteractionState}
              css={{ width: '100%' }}
              onClick={(e) => {
                e.stopPropagation()
                onClick?.()
              }}
            >
              Manage Liquidity
            </Button>
          )}
          {!didProvideLiquidity && (
            <Button
              variant="primary"
              size="large"
              state={cardInteractionState}
              css={{ width: '100%' }}
              onClick={(e) => {
                e.stopPropagation()
                onClick?.()
              }}
            >
              Add Liquidity
            </Button>
          )}
        </Inline>
      </CardContent>
    </Card>
  )
}
