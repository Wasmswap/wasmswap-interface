import { useTokenDollarValue } from 'hooks/useTokenDollarValue'
import {
  Button,
  Column,
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
  ImageForTokenLogo,
  InfoIcon,
  Inline,
  protectAgainstNaN,
  Text,
  Tooltip,
} from 'junoblocks'
import { useMemo } from 'react'

import { TokenInfo } from '../../../queries/usePoolsListQuery'

type AdditionalUnderlyingAssetsRowProps = {
  assets: Array<{
    tokenInfo: Pick<TokenInfo, 'symbol' | 'logoURI'>
    tokenAmount: number
  }>
}

export const AdditionalUnderlyingAssetsRow = ({
  assets,
}: AdditionalUnderlyingAssetsRowProps) => {
  const assetsBreakdownInfo = useMemo(
    () => (
      <Column>
        {assets.map(({ tokenInfo, tokenAmount }) => (
          <Text key={tokenInfo.symbol} variant="link" color="white">
            {formatTokenBalance(tokenAmount, { includeCommaSeparation: true })}{' '}
            {tokenInfo.symbol} (
            <DisplayTokenPrice
              tokenSymbol={tokenInfo.symbol}
              tokenAmount={tokenAmount}
            />
            )
          </Text>
        ))}
      </Column>
    ),
    [assets]
  )

  return (
    <Inline justifyContent="space-between">
      <Inline gap={4}>
        <Inline>
          {assets.slice(0, 3).map(({ tokenInfo }) => {
            return (
              <ImageForTokenLogo
                size="large"
                key={tokenInfo.symbol}
                logoURI={tokenInfo.logoURI}
                alt={tokenInfo.symbol}
              />
            )
          })}
        </Inline>
        <Text variant="link">{assets.length} more tokens</Text>
      </Inline>
      <Tooltip
        label={assetsBreakdownInfo}
        aria-label="Additional token rewards info"
      >
        <Button variant="ghost" size="small" icon={<InfoIcon />} />
      </Tooltip>
    </Inline>
  )
}

const DisplayTokenPrice = ({ tokenSymbol, tokenAmount }) => {
  const [dollarPrice] = useTokenDollarValue(tokenSymbol)
  const formattedDollarPrice = dollarValueFormatterWithDecimals(
    protectAgainstNaN(tokenAmount * dollarPrice),
    { includeCommaSeparation: true }
  )
  return <>${formattedDollarPrice}</>
}
