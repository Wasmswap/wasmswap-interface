import {
  Button,
  Card,
  CardContent,
  Column,
  Divider,
  Inline,
  Text,
} from 'components'
import { LiquidityInfoType } from 'hooks/usePoolLiquidity'
import { useSubscribeInteractions } from 'hooks/useSubscribeInteractions'
import { useTokenInfo } from 'hooks/useTokenInfo'
import {
  convertMicroDenomToDenom,
  dollarValueFormatterWithDecimals,
  protectAgainstNaN,
} from 'util/conversion'

import { UnderlyingAssetRow } from './UnderlyingAssetRow'

type ManageLiquidityCardProps = Pick<
  LiquidityInfoType,
  'myReserve' | 'tokenDollarValue' | 'myStakedLiquidity'
> & {
  onClick: () => void
  tokenASymbol: string
  tokenBSymbol: string
  supportsIncentives?: boolean
}

export const ManageLiquidityCard = ({
  onClick,
  myReserve,
  tokenDollarValue,
  tokenASymbol,
  tokenBSymbol,
  myStakedLiquidity,
  supportsIncentives,
}: ManageLiquidityCardProps) => {
  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

  const [refForCard, cardInteractionState] = useSubscribeInteractions()

  const providedLiquidity = myReserve?.[0] > 0
  const bondedLiquidity = myStakedLiquidity?.tokenAmount > 0

  const tokenAReserve = convertMicroDenomToDenom(
    myReserve?.[0],
    tokenA.decimals
  )
  const tokenBReserve = convertMicroDenomToDenom(
    myReserve?.[1],
    tokenB.decimals
  )

  const availableLiquidityInDollarValue =
    convertMicroDenomToDenom(myReserve?.[0], tokenA.decimals) *
    tokenDollarValue *
    2

  const stakedLiquidityInDollarValue = myStakedLiquidity?.dollarValue ?? 0

  const providedLiquidityDollarValue = dollarValueFormatterWithDecimals(
    protectAgainstNaN(
      stakedLiquidityInDollarValue + availableLiquidityInDollarValue
    ) || '0.00',
    { includeCommaSeparation: true }
  )

  return (
    <Card
      ref={refForCard}
      tabIndex={-1}
      role="button"
      variant={providedLiquidity || bondedLiquidity ? 'primary' : 'secondary'}
      onClick={onClick}
    >
      <CardContent>
        <Text variant="legend" color="body" css={{ padding: '$16 0 $6' }}>
          Your liquidity
        </Text>
        <Text variant="hero">${providedLiquidityDollarValue}</Text>
        <Text variant="link" color="brand" css={{ paddingTop: '$2' }}>
          $
          {dollarValueFormatterWithDecimals(availableLiquidityInDollarValue, {
            includeCommaSeparation: true,
          })}{' '}
          available
          {supportsIncentives ? ' to stake' : ''}
        </Text>
      </CardContent>
      <Divider offsetTop="$14" offsetBottom="$12" />
      <CardContent>
        <Text variant="legend" color="secondary" css={{ paddingBottom: '$12' }}>
          Underlying assets
        </Text>
        <Column gap={6} css={{ paddingBottom: '$16' }}>
          <UnderlyingAssetRow
            tokenSymbol={tokenA.symbol}
            tokenAmount={tokenAReserve}
          />
          <UnderlyingAssetRow
            tokenSymbol={tokenB.symbol}
            tokenAmount={tokenBReserve}
          />
        </Column>
        <Inline css={{ paddingBottom: '$12' }}>
          {providedLiquidity && (
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
          {!providedLiquidity && (
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
