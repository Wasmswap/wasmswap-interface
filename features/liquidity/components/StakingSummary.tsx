import { styled } from '@stitches/react'
import { Text } from '../../../components/Text'
import { TokenInfo } from '../../../hooks/useTokenInfo'
import { useTokenDollarValue } from '../../../hooks/useTokenDollarValue'
import {
  dollarValueFormatter,
  formatTokenBalance,
} from '../../../util/conversion'
import { useRef, useState } from 'react'

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
      <Text type="caption" paddingTop="16px" paddingBottom="12px">
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
          <StyledTextForInputWithSymbol variant="light" type="microscopic">
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
    <Text
      textTransform="uppercase"
      type="microscopic"
      variant="light"
      wrap="pre"
    >
      {formatTokenBalance(amount)} {name}
    </Text>
  </StyledDivForToken>
)

const StyledDivForColumn = styled('div', {
  variants: {
    kind: {
      content: {},
      value: {
        borderRadius: '6px',
        transition: 'background-color .1s ease-out',
        backgroundColor: 'rgba(25, 29, 32, 0.1)',
        '&:hover': {
          backgroundColor: 'rgba(25, 29, 32, 0.15)',
        },
        '&:active': {
          backgroundColor: 'rgba(25, 29, 32, 0.05)',
        },
      },
    },
    active: {
      false: {},
      true: {
        backgroundColor: 'rgba(25, 29, 32, 0.05) !important',
      },
    },
  },
})

const StyledDivForGrid = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBottom: '16px',
})

const StyledDivForTokensGrid = styled('div', {
  display: 'flex',
  alignItems: 'center',
  rowGap: '8px',
  flexWrap: 'wrap',
})

const StyledDivForToken = styled('div', {
  display: 'flex',
  alignItems: 'center',
  columnGap: '9px',
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
  padding: '8px 14px',
  columnGap: '4px',
  minWidth: '107px',
})
