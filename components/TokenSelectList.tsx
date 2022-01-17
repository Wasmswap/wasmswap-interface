import { styled } from 'components/theme'
import { TokenInfo } from 'hooks/useTokenList'
import { Text } from 'components/Text'
import { formatTokenBalance } from 'util/conversion'
import { useTokenBalance } from 'hooks/useTokenBalance'
import { useIBCTokenBalance } from '../hooks/useIBCTokenBalance'
import { ButtonForWrapper } from './Button'
import { ComponentPropsWithoutRef } from 'react'
import { Spinner } from './Spinner'

type TokenSelectList = {
  activeTokenSymbol?: string
  tokenList: Array<Pick<TokenInfo, 'symbol' | 'logoURI' | 'name'>>
  onSelect: (tokenSymbol: string) => void
  fetchingBalanceMode: 'native' | 'ibc'
  visibleNumberOfTokensInViewport?: number
}

const StyledDivForWrapper = styled('div', {
  overflowY: 'scroll',
})

export const TokenSelectList = ({
  activeTokenSymbol,
  tokenList,
  onSelect,
  fetchingBalanceMode = 'native',
  visibleNumberOfTokensInViewport = 5.5,
  ...props
}: TokenSelectList & ComponentPropsWithoutRef<typeof StyledDivForWrapper>) => {
  return (
    <StyledDivForWrapper
      {...props}
      css={{
        maxHeight: `${visibleNumberOfTokensInViewport * 3.5}rem`,
        ...(props.css ? props.css : {}),
      }}
    >
      {tokenList?.map((tokenInfo) => {
        return (
          <StyledButtonForRow
            role="listitem"
            variant="ghost"
            key={tokenInfo.symbol}
            selected={tokenInfo.symbol === activeTokenSymbol}
            onClick={() => {
              onSelect(tokenInfo.symbol)
            }}
          >
            <StyledDivForColumn kind="token">
              <StyledImgForTokenLogo
                as={tokenInfo.logoURI ? 'img' : 'div'}
                src={tokenInfo.logoURI}
                alt={tokenInfo.symbol}
              />
              <div data-token-info="">
                <Text variant="body">{tokenInfo.symbol}</Text>
                <Text variant="caption" color="disabled">
                  {tokenInfo.name}
                </Text>
              </div>
            </StyledDivForColumn>
            <StyledDivForColumn kind="balance">
              <Text variant="body">
                {fetchingBalanceMode === 'native' && (
                  <FetchBalanceTextForNativeTokenSymbol
                    tokenSymbol={tokenInfo.symbol}
                  />
                )}
                {fetchingBalanceMode === 'ibc' && (
                  <FetchBalanceTextForIbcTokenSymbol
                    tokenSymbol={tokenInfo.symbol}
                  />
                )}
              </Text>
              <Text variant="caption" color="disabled">
                available
              </Text>
            </StyledDivForColumn>
          </StyledButtonForRow>
        )
      })}
    </StyledDivForWrapper>
  )
}

const FetchBalanceTextForNativeTokenSymbol = ({ tokenSymbol }) => {
  const { balance, isLoading } = useTokenBalance(tokenSymbol)
  return (
    <>{isLoading ? <Spinner size={16} /> : formatTokenBalance(balance || 0)}</>
  )
}

const FetchBalanceTextForIbcTokenSymbol = ({ tokenSymbol }) => {
  const { balance, isLoading } = useIBCTokenBalance(tokenSymbol)
  return (
    <>{isLoading ? <Spinner size={16} /> : formatTokenBalance(balance || 0)}</>
  )
}

const StyledButtonForRow = styled(ButtonForWrapper, {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '$4 $6 !important',
  userSelect: 'none',
  cursor: 'pointer',
  marginBottom: '$2',
  '&:last-child': {
    marginBottom: 0,
  },
})

const StyledDivForColumn = styled('div', {
  display: 'grid',
  variants: {
    kind: {
      token: {
        columnGap: '$space$6',
        gridTemplateColumns: '30px 1fr',
        alignItems: 'center',
      },
      balance: {
        textAlign: 'right',
      },
    },
  },
})

const StyledImgForTokenLogo = styled('img', {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  backgroundColor: '#ccc',
})
