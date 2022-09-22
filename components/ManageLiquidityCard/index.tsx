import { UnderlyingAssetRow } from '../../features/liquidity/components/UnderlyingAssetRow'
import { TokenInfo } from '../../queries/usePoolsListQuery'
import {
  Button,
  Card,
  CardContent,
  Column,
  Divider,
  dollarValueFormatterWithDecimals,
  Inline,
  Text,
} from 'junoblocks'
import { FC } from 'react'

export type ManageLiquidityCardProps = {
  liquidityDollarValue?: number
  availableToBondDollarValue?: number
  supportsIncentives: boolean
  didProvideLiquidity: boolean
  tokenAInfo: TokenInfo
  tokenBInfo: TokenInfo
  tokenAReserve: number
  tokenBReserve: number
  onClick: () => void
}

export const ManageLiquidityCard: FC<ManageLiquidityCardProps> = ({
  liquidityDollarValue,
  availableToBondDollarValue,
  supportsIncentives,
  didProvideLiquidity,
  tokenAInfo,
  tokenBInfo,
  tokenAReserve,
  tokenBReserve,
  onClick,
}) => {
  return (
    <Card
      tabIndex={-1}
      role="button"
      variant={didProvideLiquidity ? 'primary' : 'secondary'}
      onClick={onClick}
    >
      <CardContent>
        <Text variant="legend" color="body" css={{ padding: '$16 0 $6' }}>
          Holdings
        </Text>
        <Text variant="hero">${liquidityDollarValue}</Text>
        <Text variant="link" color="brand" css={{ paddingTop: '$2' }}>
          $
          {dollarValueFormatterWithDecimals(availableToBondDollarValue, {
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
          <UnderlyingAssetRow tokenInfo={tokenAInfo} tokenAmount={tokenAReserve} />
          <UnderlyingAssetRow tokenInfo={tokenBInfo} tokenAmount={tokenBReserve} />
        </Column>
        <Inline css={{ paddingBottom: '$12' }}>
          {didProvideLiquidity && (
            <Button
              variant="secondary"
              size="large"
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
