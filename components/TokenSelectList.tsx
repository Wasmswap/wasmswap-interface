import { useIBCTokenBalance } from 'hooks/useIBCTokenBalance'
import { useTokenBalance } from 'hooks/useTokenBalance'
import {
  ButtonForWrapper,
  Divider,
  formatTokenBalance,
  ImageForTokenLogo,
  Inline,
  RejectIcon,
  Spinner,
  styled,
  Text,
} from 'junoblocks'
import { ComponentPropsWithoutRef, useMemo } from 'react'

import { TokenInfo } from '../queries/usePoolsListQuery'
import { getPropsForInteractiveElement } from '../util/getPropsForInteractiveElement'

const StyledDivForScrollContainer = styled('div', {
  overflowY: 'scroll',
})

export type TokenSelectListProps = {
  activeTokenSymbol?: string
  tokenList: Array<Pick<TokenInfo, 'symbol' | 'logoURI' | 'name'>>
  onSelect: (tokenSymbol: string) => void
  fetchingBalanceMode: 'native' | 'ibc'
  visibleNumberOfTokensInViewport?: number
  queryFilter?: string
  emptyStateLabel?: string
} & ComponentPropsWithoutRef<typeof StyledDivForScrollContainer>

export const TokenSelectList = ({
  activeTokenSymbol,
  tokenList,
  onSelect,
  fetchingBalanceMode = 'native',
  visibleNumberOfTokensInViewport = 5.5,
  emptyStateLabel = 'No result',
  queryFilter,
  ...props
}: TokenSelectListProps) => {
  const filteredTokenList = useMemo(() => {
    if (!tokenList || isQueryEmpty(queryFilter)) {
      return tokenList
    }

    const lowerCasedQueryFilter = queryFilter.toLowerCase()
    return tokenList
      .filter(({ symbol, name }) => {
        return (
          symbol.toLowerCase().search(lowerCasedQueryFilter) >= 0 ||
          name.toLowerCase().search(lowerCasedQueryFilter) >= 0
        )
      })
      .sort((tokenA, tokenB) => {
        if (
          tokenA.symbol.toLowerCase().startsWith(lowerCasedQueryFilter) ||
          tokenA.name.toLowerCase().startsWith(lowerCasedQueryFilter)
        ) {
          return -1
        }
        if (
          tokenB.symbol.toLowerCase().startsWith(lowerCasedQueryFilter) ||
          tokenB.name.toLowerCase().startsWith(lowerCasedQueryFilter)
        ) {
          return 1
        }
        return 0
      })
  }, [tokenList, queryFilter])

  return (
    <>
      <Inline css={{ padding: '0 $8' }}>
        <Divider />
      </Inline>

      <StyledDivForScrollContainer
        {...props}
        css={{
          height: `${visibleNumberOfTokensInViewport * 3.5}rem`,
          ...(props.css ? props.css : {}),
        }}
      >
        {filteredTokenList?.map((tokenInfo) => {
          return (
            <StyledButtonForRow
              role="listitem"
              variant="ghost"
              key={tokenInfo.symbol}
              selected={tokenInfo.symbol === activeTokenSymbol}
              {...getPropsForInteractiveElement({
                onClick() {
                  onSelect(tokenInfo.symbol)
                },
              })}
            >
              <StyledDivForColumn kind="token">
                <ImageForTokenLogo
                  logoURI={tokenInfo.logoURI}
                  size="big"
                  alt={tokenInfo.symbol}
                  loading="lazy"
                />
                <div data-token-info="">
                  <Text variant="body">{tokenInfo.symbol}</Text>
                  <Text variant="caption" color="disabled">
                    {tokenInfo.name}
                  </Text>
                </div>
              </StyledDivForColumn>
              <StyledDivForColumn kind="balance">
                <Text
                  variant="body"
                  align="right"
                  css={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}
                >
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
        {(filteredTokenList?.length || filteredTokenList?.length) === 0 && (
          <Inline gap={6} css={{ padding: '$5 $6' }}>
            <ImageForTokenLogo size="big">
              <RejectIcon color="tertiary" />
            </ImageForTokenLogo>
            <Text variant="secondary">{emptyStateLabel}</Text>
          </Inline>
        )}
      </StyledDivForScrollContainer>
    </>
  )
}

function isQueryEmpty(query: string) {
  return !query || !query.replace(new RegExp(' ', 'g'), '')
}

const FetchBalanceTextForNativeTokenSymbol = ({ tokenSymbol }) => {
  const { balance, isLoading } = useTokenBalance(tokenSymbol)
  return (
    <>
      {isLoading ? (
        <Spinner size={18} style={{ margin: 0 }} />
      ) : (
        formatTokenBalance(balance || 0)
      )}
    </>
  )
}

const FetchBalanceTextForIbcTokenSymbol = ({ tokenSymbol }) => {
  const { balance, isLoading } = useIBCTokenBalance(tokenSymbol)
  return (
    <>
      {isLoading ? (
        <Spinner size={18} style={{ margin: 0 }} />
      ) : (
        formatTokenBalance(balance || 0)
      )}
    </>
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
