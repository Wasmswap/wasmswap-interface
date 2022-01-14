import { styled } from 'components/theme'
import { Text } from 'components/Text'
import { Button } from 'components/Button'
import { convertMicroDenomToDenom, formatTokenBalance } from 'util/conversion'
import { parseCurrency } from './PoolCard'
import { LiquidityInfoType } from 'hooks/usePoolLiquidity'
import { useTokenInfo } from 'hooks/useTokenInfo'

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
        <Text variant="body" css={{ paddingBottom: '$4' }}>
          {typeof myLiquidity === 'number'
            ? `You own ${formatTokenBalance(
                ((myLiquidity as LiquidityInfoType['myLiquidity']).coins /
                  totalLiquidity.coins) *
                  100
              )}% of the pool`
            : 'Your liquidity'}
        </Text>
        <Text variant="hero" css={{ paddingBottom: '$18' }}>
          {parseCurrency(
            convertMicroDenomToDenom(myReserve[0], tokenA.decimals) *
              tokenDollarValue *
              2 || '0.00'
          )}
        </Text>
      </StyledElementForCardLayout>
      <StyledElementForCardLayout kind="content">
        <Text variant="body" color="secondary" css={{ padding: '$7 0 $9' }}>
          Underlying assets
        </Text>
        <StyledElementForTokens kind="wrapper">
          <StyledElementForTokens kind="element">
            <StyledImageForToken
              as={tokenA?.logoURI ? 'img' : 'div'}
              src={tokenA?.logoURI}
              alt={tokenASymbol}
            />
            <Text color="body" variant="caption" wrap={false}>
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
            <Text color="body" variant="caption" wrap={false}>
              {formatTokenBalance(
                convertMicroDenomToDenom(myReserve[1], tokenB.decimals)
              )}{' '}
              {tokenBSymbol}
            </Text>
          </StyledElementForTokens>
        </StyledElementForTokens>
        <Button css={{ width: '100%' }} onClick={onButtonClick} size="large">
          {myReserve[1] > 0 ? 'Manage liquidity' : 'Add liquidity'}
        </Button>
      </StyledElementForCardLayout>
    </StyledElementForCardLayout>
  )
}

const StyledElementForCardLayout = styled('div', {
  variants: {
    kind: {
      wrapper: {
        backgroundColor: '$backgroundColors$primary',
        padding: '$9 0 $12',
        borderRadius: '8px',
      },
      content: {
        padding: '0 $12',
        '&:not(&:last-child)': {
          borderBottom: '1px solid $borderColors$inactive',
        },
      },
    },
    name: {
      liquidity: {
        padding: '0 $12',
      },
    },
  },
})

const StyledElementForTokens = styled('div', {
  display: 'grid',

  variants: {
    kind: {
      element: {
        gridTemplateColumns: '20px auto',
        alignItems: 'center',
        columnGap: '$space$3',
      },
      wrapper: {
        gridTemplateColumns: '1fr 1fr',
        columnGap: '$space$8',
        paddingBottom: '$10',
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
