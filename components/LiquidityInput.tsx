import React, { FC } from 'react'
import styled from 'styled-components'
import { Text } from './Text'

type LiquidityInputProps = {
  tokenName: string
  balance: number
  amount: number
  ratio: number
  onAmountChange: (value: number) => void
}

const balanceFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
})

export const LiquidityInput: FC<LiquidityInputProps> = ({
  tokenName,
  balance,
  ratio,
  amount,
  onAmountChange,
}) => {
  const handleAmountChange = ({ target: { value } }) =>
    onAmountChange(Number(value))

  return (
    <StyledInputBox>
      <StyledRow>
        <StyledTokenWrapper>
          <Text variant="light">
            {tokenName} - {ratio}%
          </Text>
        </StyledTokenWrapper>
        <Text>
          <StyledInput
            type="number"
            placeholder="0.0"
            min={0}
            value={balanceFormatter.format(amount)}
            onChange={onAmountChange ? handleAmountChange : undefined}
            autoComplete="off"
            readOnly={!onAmountChange}
          />
        </Text>
      </StyledRow>
      <StyledRow>
        <StyledSubRow>
          <Text type="caption" variant="light" color="gray">
            Total available: <b>{balance}</b>
          </Text>
        </StyledSubRow>
      </StyledRow>
    </StyledInputBox>
  )
}

const StyledInputBox = styled.div`
  background-color: #fafafa;
  border-radius: 16px;
  padding: 20px 18px;
  margin-bottom: 8px;
`

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  &:not(&:first-child) {
    padding-top: 10px;
  }
`

const StyledSubRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const StyledTokenWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 12px;
  position: relative;
  padding: 8px 12px;
  white-space: nowrap;
`

const StyledInput = styled.input`
  border: none;
  outline: none;
  display: block;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  padding: 0;
  background: transparent;
  text-align: right;
`
