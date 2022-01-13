import { styled } from 'components/theme'
import { useTokenList } from 'hooks/useTokenList'
import { Text } from 'components/Text'
import { formatTokenBalance } from 'util/conversion'
import { useTokenBalance } from 'hooks/useTokenBalance'

export const TokenOptionsList = ({ activeTokenSymbol, onSelect }) => {
  const [tokenList] = useTokenList()
  return (
    <>
      {tokenList?.tokens.map((tokenInfo) => {
        return (
          <StyledDivForRow
            role="listitem"
            key={tokenInfo.symbol}
            active={tokenInfo.symbol === activeTokenSymbol}
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
                <FetchBalanceTextForTokenSymbol
                  tokenSymbol={tokenInfo.symbol}
                />
              </Text>
              <Text variant="caption" color="disabled">
                available
              </Text>
            </StyledDivForColumn>
          </StyledDivForRow>
        )
      })}
    </>
  )
}

const FetchBalanceTextForTokenSymbol = ({ tokenSymbol }) => {
  const { balance } = useTokenBalance(tokenSymbol)
  return <>{formatTokenBalance(balance || 0)}</>
}

const StyledDivForRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 12px',
  borderRadius: '6px',
  userSelect: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.1s ease-out',
  marginBottom: 5,
  '&:hover': {
    backgroundColor: '$colors$dark10',
  },
  '&:active': {
    backgroundColor: '$colors$dark05',
  },
  '&:last-child': {
    marginBottom: 0,
  },
  variants: {
    active: {
      true: {
        backgroundColor: '$colors$dark05',
      },
      false: {
        backgroundColor: '$colors$dark0',
      },
    },
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
