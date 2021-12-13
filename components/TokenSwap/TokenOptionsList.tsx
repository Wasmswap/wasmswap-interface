import nativeTokenList from '../../public/token_list.json'
import externalTokenList from '../../public/ibc_assets.json'
import { IBCAssetInfo } from '../../hooks/useIBCAssetInfo'
import { TokenInfo } from '../../hooks/useTokenInfo'
import { styled } from '@stitches/react'
import { Text } from '../Text'
import { formatTokenBalance } from '../../util/conversion'
import { useTokenBalance } from '../../hooks/useTokenBalance'

const tokenList: Array<IBCAssetInfo | TokenInfo> = [
  ...(nativeTokenList.tokens as Array<TokenInfo>),
  ...(externalTokenList.tokens as Array<IBCAssetInfo>),
]

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
                <Text type="caption" variant="bold" color="#858585">
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
              <Text type="caption" variant="bold" color="#858585">
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
