import { styled } from 'components/theme'
import nativeTokenList from '../../../public/token_list.json'
import { TokenInfo } from '../../../hooks/useTokenInfo'
import { Text } from '../../../components/Text'
import { formatTokenBalance } from '../../../util/conversion'
import { useTokenBalance } from '../../../hooks/useTokenBalance'

const tokenList: Array<TokenInfo> = nativeTokenList.tokens as Array<TokenInfo>

export const TokenOptionsList = ({ activeTokenSymbol, onSelect }) => {
  return (
    <>
      {tokenList.map((tokenInfo) => {
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
                <Text type="caption" variant="bold">
                  {tokenInfo.symbol}
                </Text>
                <Text type="microscopic" variant="normal" color="disabled">
                  {tokenInfo.name}
                </Text>
              </div>
            </StyledDivForColumn>
            <StyledDivForColumn kind="balance">
              <Text type="caption" variant="bold">
                <FetchBalanceTextForTokenSymbol
                  tokenSymbol={tokenInfo.symbol}
                />
              </Text>
              <Text type="microscopic" variant="normal" color="disabled">
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
    backgroundColor: 'rgba(25, 29, 32, 0.1)',
  },
  '&:active': {
    backgroundColor: 'rgba(25, 29, 32, 0.05)',
  },
  '&:last-child': {
    marginBottom: 0,
  },
  variants: {
    active: {
      true: {
        backgroundColor: 'rgba(25, 29, 32, 0.05)',
      },
      false: {
        backgroundColor: 'rgba(25, 29, 32, 0)',
      },
    },
  },
})

const StyledDivForColumn = styled('div', {
  display: 'grid',
  variants: {
    kind: {
      token: {
        columnGap: '12px',
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
