import {
  Button,
  Column,
  ImageForTokenLogo,
  Inline,
  Text,
  Tooltip,
} from 'components'
import { TokenInfo } from 'hooks/useTokenList'
import { InfoIcon } from 'icons'
import { useMemo } from 'react'
import { formatTokenBalance } from 'util/conversion'

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
            {tokenInfo.symbol}
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
