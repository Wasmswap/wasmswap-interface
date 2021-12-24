import { styled } from '@stitches/react'
import { Text } from '../../../components/Text'
import { Button } from '../../../components/Button'
import {
  convertMicroDenomToDenom,
  formatTokenBalance,
} from '../../../util/conversion'
import { parseCurrency } from './PoolCard'
import { LiquidityInfoType } from '../../../hooks/usePoolLiquidity'
import { useTokenInfo } from '../../../hooks/useTokenInfo'

type PoolAvailableLiquidityCardProps = Pick<
  LiquidityInfoType,
  'myLiquidity' | 'myReserve' | 'totalLiquidity' | 'tokenDollarValue'
> & {
  onButtonClick: () => void
  tokenASymbol: string
  tokenBSymbol: string
}

export const PoolAvailableLiquidityCard = ({
  onButtonClick,
  myLiquidity,
  myReserve,
  tokenDollarValue,
  totalLiquidity,
  tokenASymbol,
  tokenBSymbol,
}: PoolAvailableLiquidityCardProps) => {
  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

  return (
    <StyledElementForCardLayout kind="wrapper">
      <StyledElementForCardLayout kind="content" name="liquidity">
        <Text
          type="caption"
          color="secondaryText"
          variant="light"
          paddingBottom="9px"
        >
          {typeof myLiquidity === 'number'
            ? `You own ${formatTokenBalance(
                ((myLiquidity as LiquidityInfoType['myLiquidity']).coins /
                  totalLiquidity.coins) *
                  100
              )}% of the pool`
            : 'Your liquidity'}
        </Text>
        <StyledTextForAmount>
          {parseCurrency(
            convertMicroDenomToDenom(myReserve[0], tokenA.decimals) *
              tokenDollarValue *
              2 || '0.00'
          )}
        </StyledTextForAmount>
      </StyledElementForCardLayout>
      <StyledElementForCardLayout kind="content">
        <StyledElementForTokens kind="wrapper">
          <StyledElementForTokens kind="element">
            <StyledImageForToken
              as={tokenA?.logoURI ? 'img' : 'div'}
              src={tokenA?.logoURI}
              alt={tokenASymbol}
            />
            <Text color="bodyText" type="microscopic">
              {formatTokenBalance(
                convertMicroDenomToDenom(myReserve[0], tokenA.decimals)
              )}{' '}
              {tokenASymbol}
            </Text>
          </StyledElementForTokens>
          <StyledElementForTokens kind="element">
            <StyledImageForToken
              as={tokenA?.logoURI ? 'img' : 'div'}
              src={tokenB?.logoURI}
              alt={tokenBSymbol}
            />
            <Text color="bodyText" type="microscopic">
              {formatTokenBalance(
                convertMicroDenomToDenom(myReserve[1], tokenB.decimals)
              )}{' '}
              {tokenBSymbol}
            </Text>
          </StyledElementForTokens>
        </StyledElementForTokens>
        <StyledButton onClick={onButtonClick}>
          Add / Remove liquidity
        </StyledButton>
      </StyledElementForCardLayout>
    </StyledElementForCardLayout>
  )
}

const StyledElementForCardLayout = styled('div', {
  variants: {
    kind: {
      wrapper: {
        backgroundColor: 'rgba(25, 29, 32, 0.1)',
        padding: '20px 0 22px',
        borderRadius: '8px',
      },
      content: {
        padding: '0 24px',
        '&:not(&:last-child)': {
          borderBottom: '1px solid rgba(25, 29, 32, 0.1)',
        },
      },
    },
    name: {
      liquidity: {
        padding: '0 24px 26px',
      },
    },
  },
})

const StyledTextForAmount = styled('p', {
  fontSize: '30px',
  lineHeight: '24px',
  fontWeight: 600,
})

const StyledElementForTokens = styled('div', {
  display: 'grid',

  variants: {
    kind: {
      element: {
        gridTemplateColumns: '20px auto',
        alignItems: 'center',
        columnGap: '6px',
      },
      wrapper: {
        rowGap: '16px',
        paddingTop: '22px',
        paddingBottom: '24px',
      },
    },
  },
})

const StyledImageForToken = styled('img', {
  width: 20,
  height: 20,
  borderRadius: '50%',
  backgroundColor: '#ccc',
})

const StyledButton = styled(Button, {
  width: '100% !important',
})
