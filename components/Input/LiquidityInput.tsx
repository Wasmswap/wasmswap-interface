import {
  BasicNumberInput,
  formatTokenBalance,
  ImageForTokenLogo,
  styled,
  Text,
} from 'junoblocks'
import React, { FC, useRef, useState } from 'react'

import { useTokenInfo } from '../../hooks/useTokenInfo'

type LiquidityInputProps = {
  tokenSymbol: string
  availableAmount: number
  maxApplicableAmount: number
  amount: number
  onAmountChange: (value: number) => void
}

export const LiquidityInput: FC<LiquidityInputProps> = ({
  tokenSymbol,
  availableAmount,
  maxApplicableAmount,
  amount,
  onAmountChange,
}) => {
  const [focusedOnInput, setFocusedOnInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>()

  const { name: tokenName, logoURI } = useTokenInfo(tokenSymbol)

  const handleAmountChange = (value: number) => onAmountChange(value)

  return (
    <StyledDivForWrapper
      onClick={() => {
        inputRef.current.focus()
      }}
      active={focusedOnInput}
    >
      <StyledDivForColumn kind="info">
        <ImageForTokenLogo logoURI={logoURI} alt={tokenName} size="big" />
        <div data-token-info="">
          <Text variant="title" transform="uppercase">
            {tokenName}
          </Text>
          <Text variant="caption" color="tertiary">
            {formatTokenBalance(availableAmount)} available
          </Text>
        </div>
      </StyledDivForColumn>
      <StyledDivForColumn kind="input">
        <Text variant="primary">
          <BasicNumberInput
            ref={inputRef}
            value={Number(formatTokenBalance(amount))}
            min={0}
            max={maxApplicableAmount}
            onChange={handleAmountChange}
            onFocus={() => {
              setFocusedOnInput(true)
            }}
            onBlur={() => {
              setFocusedOnInput(false)
            }}
          />
        </Text>
      </StyledDivForColumn>
    </StyledDivForWrapper>
  )
}

const StyledDivForWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '$colors$dark10',
  borderRadius: '$1',
  padding: '$6 $12 $5 $5',
  width: '100%',
  transition: 'background 0.1s ease-out',
  '&:hover': {
    backgroundColor: '$colors$dark15',
  },
  '&:active': {
    backgroundColor: '$colors$dark5',
  },
  variants: {
    active: {
      true: {
        backgroundColor: '$colors$dark10 !important',
      },
    },
  },
})

const StyledDivForColumn = styled('div', {
  variants: {
    kind: {
      info: {
        display: 'flex',
        alignItems: 'center',
        columnGap: '$space$6',
      },
      input: {
        textAlign: 'right',
      },
    },
  },
})
