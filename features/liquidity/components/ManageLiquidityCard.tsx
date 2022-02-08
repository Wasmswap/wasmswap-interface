import { Text } from 'components/Text'
import { Button } from 'components/Button'
import { Card, CardContent } from 'components/Card'
import { PlusIcon } from '../../../icons/Plus'
import {
  convertMicroDenomToDenom,
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
} from 'util/conversion'
import { SharesIcon } from '../../../icons/Shares'
import { LiquidityInfoType } from 'hooks/usePoolLiquidity'
import { useTokenInfo } from 'hooks/useTokenInfo'
import { Inline } from '../../../components/Inline'
import { Divider } from '../../../components/Divider'
import { ImageForTokenLogo } from '../../../components/ImageForTokenLogo'

type ManageLiquidityCardProps = Pick<
  LiquidityInfoType,
  'myReserve' | 'tokenDollarValue'
> & {
  onAddLiquidityClick: () => void
  onRemoveLiquidityClick: () => void
  tokenASymbol: string
  tokenBSymbol: string
}

export const ManageLiquidityCard = ({
  onAddLiquidityClick,
  onRemoveLiquidityClick,
  myReserve,
  tokenDollarValue,
  tokenASymbol,
  tokenBSymbol,
}: ManageLiquidityCardProps) => {
  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

  const providedLiquidity = myReserve?.[0] > 0

  const tokenAReserve = formatTokenBalance(
    convertMicroDenomToDenom(myReserve[0], tokenA.decimals),
    { includeCommaSeparation: true }
  )
  const tokenBReserve = formatTokenBalance(
    convertMicroDenomToDenom(myReserve[1], tokenB.decimals),
    { includeCommaSeparation: true }
  )

  const providedLiquidityDollarValue = dollarValueFormatterWithDecimals(
    convertMicroDenomToDenom(myReserve[0], tokenA.decimals) *
      tokenDollarValue *
      2 || '0.00',
    { includeCommaSeparation: true }
  )

  return (
    <Card>
      <CardContent>
        <Inline gap={1} css={{ padding: '$12 0 $3' }}>
          <SharesIcon size="24px" />
          <Text variant="legend" color="body">
            Available liquidity
          </Text>
        </Inline>
        <Text variant="hero">${providedLiquidityDollarValue}</Text>
      </CardContent>
      <Divider offsetTop="$16" offsetBottom="$10" />
      <CardContent>
        <Text variant="legend" color="secondary">
          Underlying assets
        </Text>
        <Inline gap={12} css={{ padding: '$6 0 $18' }}>
          <Inline gap={3}>
            <ImageForTokenLogo
              size="large"
              logoURI={tokenA.logoURI}
              alt={tokenA.symbol}
            />
            <Text variant="body">{tokenAReserve}</Text>
          </Inline>
          <Inline gap={3}>
            <ImageForTokenLogo
              size="large"
              logoURI={tokenB.logoURI}
              alt={tokenB.symbol}
            />
            <Text variant="body">{tokenBReserve}</Text>
          </Inline>
        </Inline>
        <Inline
          gap={4}
          justifyContent="flex-end"
          css={{ paddingBottom: '$10' }}
        >
          {providedLiquidity && (
            <>
              <Button onClick={onRemoveLiquidityClick} variant="secondary">
                Remove
              </Button>
              <Button
                onClick={onAddLiquidityClick}
                variant="secondary"
                iconRight={<PlusIcon />}
              >
                Add Liquidity
              </Button>
            </>
          )}
          {!providedLiquidity && (
            <Button
              onClick={onAddLiquidityClick}
              variant="ghost"
              iconRight={<PlusIcon />}
            >
              Add Liquidity
            </Button>
          )}
        </Inline>
      </CardContent>
    </Card>
  )
}
