import { usePoolPairTokenAmount } from 'features/liquidity/hooks'
import {
  BasicNumberInput,
  formatTokenBalance,
  ImageForTokenLogo,
  protectAgainstNaN,
  styled,
  Text,
} from 'junoblocks'
import { TokenInfo } from 'queries/usePoolsListQuery'
import { useRef, useState } from 'react'

type StakingSummaryProps = {
  label: string
  poolId: string
  tokenA: TokenInfo
  tokenB: TokenInfo
  totalLiquidityProvidedTokenAmount: number
  liquidityAmount: number
  onChangeLiquidity: (liquidityAmount: number) => void
  totalLiquidityProvidedDollarValue: number
  liquidityInDollarValue: number
}

export const StakingSummary = ({
  label,
  poolId,
  tokenA,
  tokenB,
  liquidityAmount,
  onChangeLiquidity,
  totalLiquidityProvidedDollarValue,
  liquidityInDollarValue,
}: StakingSummaryProps) => {
  const [isDollarValueInputFocused, setIsDollarValueInputFocused] =
    useState(false)

  const refForInput = useRef<HTMLInputElement>()

  const [tokenAAmount] = usePoolPairTokenAmount({
    tokenAmountInMicroDenom: liquidityAmount,
    tokenPairIndex: 0,
    poolId,
  })

  const [tokenBAmount] = usePoolPairTokenAmount({
    tokenAmountInMicroDenom: liquidityAmount,
    tokenPairIndex: 1,
    poolId,
  })

  const handleChangeDollarValue = (amount: number) => {
    const multiplier =
      liquidityInDollarValue > 0
        ? liquidityAmount / Number(liquidityInDollarValue)
        : 1

    const liquidityValue = amount * multiplier

    onChangeLiquidity(protectAgainstNaN(liquidityValue))
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
            <BasicNumberInput
              placeholder="0.0"
              min={0}
              max={(totalLiquidityProvidedDollarValue as number) || 0}
              value={(liquidityInDollarValue as number) || 0}
              maximumFractionDigits={2}
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
    <ImageForTokenLogo logoURI={logoURI} alt={name} size="large" />
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

const StyledTextForInputWithSymbol: any = styled(Text, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '$4 $7',
  columnGap: '$space$2',
  minWidth: '107px',
})
