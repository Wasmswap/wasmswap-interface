import { Card } from '../../../components/Card'
import { Inline } from '../../../components/Inline'
import { Text } from '../../../components/Text'
import { ImageForTokenLogo } from '../../../components/ImageForTokenLogo'

export const UnbondingLiquidityCard = ({ tokenA, tokenB }) => {
  return (
    <Card>
      <Inline justifyContent="space-between" css={{ padding: '$11' }}>
        <Inline gap={16}>
          <Text variant="link">$289.00</Text>
          <Inline gap={12}>
            <Inline gap={3}>
              <ImageForTokenLogo logoURI={tokenA.logoURI} alt={tokenA.symbol} />
              <Text variant="link">0 {tokenA.symbol}</Text>
            </Inline>
            <Inline gap={3}>
              <ImageForTokenLogo logoURI={tokenB.logoURI} alt={tokenB.symbol} />
              <Text variant="link">0 {tokenB.symbol}</Text>
            </Inline>
          </Inline>
        </Inline>
        <Inline>
          <Text variant="legend">3 hr left / 14 days</Text>
        </Inline>
      </Inline>
    </Card>
  )
}
