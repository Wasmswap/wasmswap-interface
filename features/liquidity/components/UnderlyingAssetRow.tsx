import { useTokenDollarValue } from 'hooks/useTokenDollarValue'
import {
  Button,
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
  ImageForTokenLogo,
  InfoIcon,
  Inline,
  protectAgainstNaN,
  Text,
  Tooltip,
} from 'junoblocks'

import { TokenInfo } from '../../../queries/usePoolsListQuery'

type UnderlyingAssetRowProps = {
  tokenInfo?: TokenInfo
  tokenAmount?: number
  visible?: boolean
}

export const UnderlyingAssetRow = ({
  tokenInfo,
  tokenAmount,
  visible = true,
}: UnderlyingAssetRowProps) => {
  const token = visible ? tokenInfo : undefined
  const [tokenDollarValue] = useTokenDollarValue(
    visible ? tokenInfo?.symbol : undefined
  )

  const tokenAmountDollarValue = dollarValueFormatterWithDecimals(
    protectAgainstNaN(tokenAmount * tokenDollarValue),
    { includeCommaSeparation: true }
  )

  const infoTooltipLabel = `≈ $${tokenAmountDollarValue} USD`

  return (
    <Inline
      justifyContent="space-between"
      css={{ visibility: visible ? 'visible' : 'hidden' }}
    >
      <Inline gap={3}>
        <ImageForTokenLogo
          size="large"
          logoURI={token?.logoURI}
          alt={token?.symbol}
        />
        <Text variant="link">{token?.symbol}</Text>
      </Inline>
      <Inline align="center" gap={4}>
        <Inline gap={6}>
          <Text variant="body">
            {formatTokenBalance(tokenAmount, { includeCommaSeparation: true })}
          </Text>
          <Text variant="secondary">{token?.symbol}</Text>
        </Inline>
        <Tooltip label={infoTooltipLabel} aria-label={infoTooltipLabel}>
          <Button
            variant="ghost"
            size="small"
            icon={<InfoIcon />}
            iconColor={tokenAmount ? 'secondary' : 'disabled'}
            disabled={!tokenAmount}
          />
        </Tooltip>
      </Inline>
    </Inline>
  )
}
