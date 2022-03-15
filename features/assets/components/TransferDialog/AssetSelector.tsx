import { useState } from 'react'
import { styled } from 'theme'
import { useIBCAssetInfo } from 'hooks/useIBCAssetInfo'
import { useIBCTokenBalance } from 'hooks/useIBCTokenBalance'
import { formatTokenBalance } from 'util/conversion'
import {
  Button,
  ButtonForWrapper,
  Text,
  IconWrapper,
  ImageForTokenLogo,
  Spinner,
} from 'components'
import { Union, Chevron } from 'icons'
import { TokenOptionsList } from './TokenOptionsList'
import { useTokenBalance } from 'hooks/useTokenBalance'

type AssetSelectorProps = {
  activeTokenSymbol: string
  onTokenSymbolSelect: (tokenSymbol: string) => void
  fetchingBalancesAgainstChain: 'ibc' | 'native'
}

export const AssetSelector = ({
  activeTokenSymbol,
  onTokenSymbolSelect,
  fetchingBalancesAgainstChain,
}: AssetSelectorProps) => {
  const assetInfo = useIBCAssetInfo(activeTokenSymbol)
  const {
    balance: ibcTokenMaxAvailableBalance,
    isLoading: externalBalanceIsLoading,
  } = useIBCTokenBalance(activeTokenSymbol)
  const {
    balance: nativeMaxAvailableBalance,
    isLoading: nativeBalanceIsLoading,
  } = useTokenBalance(activeTokenSymbol)

  const maxBalance =
    fetchingBalancesAgainstChain === 'ibc'
      ? ibcTokenMaxAvailableBalance
      : nativeMaxAvailableBalance
  const isLoading =
    fetchingBalancesAgainstChain === 'ibc'
      ? externalBalanceIsLoading
      : nativeBalanceIsLoading

  const [isTokenListOpen, setTokenListOpen] = useState(false)

  function handleToggleList() {
    setTokenListOpen(!isTokenListOpen)
  }

  return (
    <StyledDivForWrapper>
      <StyledButtonForWrapper variant="secondary" onClick={handleToggleList}>
        <StyledDivForTokenContent>
          <ImageForTokenLogo
            size="big"
            logoURI={assetInfo.logoURI}
            alt={activeTokenSymbol}
          />
          <div>
            <Text variant="body">{activeTokenSymbol}</Text>
            <Text variant="secondary">
              {formatTokenBalance(maxBalance)} available
            </Text>
          </div>
        </StyledDivForTokenContent>

        <Button
          variant="ghost"
          onClick={handleToggleList}
          icon={
            <IconWrapper
              size="16px"
              rotation="-90deg"
              color="tertiary"
              icon={
                isLoading ? (
                  <Spinner size={16} />
                ) : (
                  <>{isTokenListOpen ? <Union /> : <Chevron />}</>
                )
              }
            />
          }
        />
      </StyledButtonForWrapper>
      {isTokenListOpen && (
        <TokenOptionsList
          activeTokenSymbol={activeTokenSymbol}
          fetchingBalanceMode={fetchingBalancesAgainstChain}
          onSelect={(tokenSymbol) => {
            onTokenSymbolSelect(tokenSymbol)
            setTokenListOpen(false)
          }}
          css={{ padding: '$1 $4 $12' }}
        />
      )}
    </StyledDivForWrapper>
  )
}

const StyledDivForWrapper = styled('div', {
  backgroundColor: '$colors$dark10',
  borderRadius: '$1',
})

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
