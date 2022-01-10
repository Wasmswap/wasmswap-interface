import { useRef, useState } from 'react'
import { styled } from 'components/theme'
import { Text } from 'components/Text'
import { TokenInfo } from 'hooks/useTokenList'
import { useTokenDollarValue } from 'hooks/useTokenDollarValue'
import { dollarValueFormatter, formatTokenBalance } from 'util/conversion'

type StakingSummaryProps = {
  label: string
  tokenA: TokenInfo
  tokenB: TokenInfo
  maxLiquidity: number
  liquidityAmount: number
  onChangeLiquidity: (liquidityAmount: number) => void
}

export const StakingSummary = ({
  label,
  tokenA,
  tokenB,
  maxLiquidity,
  liquidityAmount,
  onChangeLiquidity,
}: StakingSummaryProps) => {
  const [tokenAPrice] = useTokenDollarValue(tokenA?.symbol)
  const [tokenBPrice] = useTokenDollarValue(tokenB?.symbol)

  const [isDollarValueInputFocused, setIsDollarValueInputFocused] =
    useState(false)
  const refForInput = useRef<HTMLInputElement>()

  const tokenAAmount = (liquidityAmount * 0.5) / tokenAPrice
  const tokenBAmount = (liquidityAmount * 0.5) / tokenBPrice

  const formattedLiquidityAmount = String(dollarValueFormatter(liquidityAmount))

  const handleChangeDollarValue = ({ target: { value } }) => {
    const validatedValue =
      Number(value) > maxLiquidity ? maxLiquidity : dollarValueFormatter(value)
    onChangeLiquidity(Number(validatedValue))
  }

  return (
    <>
      <Text variant="body" css={{ padding: '$8 0 $6' }}>
        {label}
      </Text>
      <StyledDivForGrid>
        <StyledDivForColumn kind="content">
          <StyledDivForTokensGrid>
            <StyledNodeForToken
              logoURI={tokenA?.logoURI}
              name={tokenA?.name}
              amount={tokenAAmount}
            />
            <StyledNodeForToken
              logoURI={tokenB?.logoURI}
              name={tokenB?.name}
              amount={tokenBAmount}
            />
          </StyledDivForTokensGrid>
        </StyledDivForColumn>
        <StyledDivForColumn
          kind="value"
          active={isDollarValueInputFocused}
          onClick={() => refForInput.current?.focus()}
          role="button"
        >
          <StyledTextForInputWithSymbol variant="caption">
            $
            <input
              ref={refForInput}
              placeholder="0.0"
              min="0"
              type="number"
              lang="en-US"
              value={formattedLiquidityAmount}
              style={{
                width: `${formattedLiquidityAmount.length}ch`,
              }}
              onChange={handleChangeDollarValue}
              onFocus={() => {
                setIsDollarValueInputFocused(true)
              }}
              onBlur={() => {
                setIsDollarValueInputFocused(false)
              }}
            />
          </StyledTextForInputWithSymbol>
        </StyledDivForColumn>
      </StyledDivForGrid>
    </>
  )
}

const StyledNodeForToken = ({ logoURI, name, amount }) => (
  <StyledDivForToken>
    <StyledImgForTokenLogo as={logoURI ? 'img' : 'div'} src={logoURI} />
    <Text transform="uppercase" variant="caption" wrap={false}>
      {formatTokenBalance(amount)} {name}
    </Text>
  </StyledDivForToken>
)

const StyledDivForColumn = styled('div', {
  variants: {
    kind: {
      content: {},
      value: {
        borderRadius: '$1',
        transition: 'background-color .1s ease-out',
        backgroundColor: '$colors$dark10',
        '&:hover': {
          backgroundColor: '$colors$dark15',
        },
        '&:active': {
          backgroundColor: '$colors$dark5',
        },
      },
    },
    active: {
      false: {},
      true: {
        backgroundColor: '$colors$dark5 !important',
      },
    },
  },
})

const StyledDivForGrid = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBottom: '$8',
})

const StyledDivForTokensGrid = styled('div', {
  display: 'flex',
  alignItems: 'center',
  rowGap: '$space$4',
  flexWrap: 'wrap',
})

const StyledDivForToken = styled('div', {
  display: 'flex',
  alignItems: 'center',
  columnGap: '$space$4',
  width: '100%',
})

const StyledImgForTokenLogo = styled('img', {
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: '#ccc',
})

const StyledTextForInputWithSymbol: any = styled(Text, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '$4 $7',
  columnGap: '$space$2',
  minWidth: '107px',
})
