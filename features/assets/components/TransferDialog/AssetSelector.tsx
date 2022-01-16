import { styled } from 'components/theme'
import { useIBCAssetInfo } from 'hooks/useIBCAssetInfo'
import { Text } from 'components/Text'
import { IconWrapper } from 'components/IconWrapper'
import { ImageForTokenLogo } from 'components/ImageForTokenLogo'
import { useIBCTokenBalance } from 'hooks/useIBCTokenBalance'
import { formatTokenBalance } from 'util/conversion'
import { Button, ButtonForWrapper } from 'components/Button'
import { Valid } from 'icons/Valid'

export const AssetSelector = ({ tokenSymbol }) => {
  const assetInfo = useIBCAssetInfo(tokenSymbol)
  const { balance: ibcTokenMaxAvailableBalance } =
    useIBCTokenBalance(tokenSymbol)

  return (
    <StyledButtonForWrapper variant="secondary">
      <StyledDivForTokenContent>
        <ImageForTokenLogo
          size="big"
          logoURI={assetInfo.logoURI}
          alt={tokenSymbol}
        />
        <div>
          <Text variant="body">{tokenSymbol}</Text>
          <Text variant="secondary">
            {formatTokenBalance(ibcTokenMaxAvailableBalance)} available
          </Text>
        </div>
      </StyledDivForTokenContent>

      <Button
        variant="secondary"
        icon={
          <IconWrapper
            size="16px"
            // rotation="-90deg"
            color="tertiary"
            icon={<Valid />}
          />
        }
      />
    </StyledButtonForWrapper>
  )
}

const StyledButtonForWrapper = styled(ButtonForWrapper, {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  userSelect: 'none',
  padding: '$8 $5 $8 $8 !important',
  columnGap: '$space$6',
})

const StyledDivForTokenContent = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  columnGap: '$space$6',
})
