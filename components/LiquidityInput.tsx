import React, { FC } from 'react'
import styled from 'styled-components'
import { Text } from './Text'
import { colorTokens } from '../util/constants'

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
      <StyledDivForInfo>
        <StyledRow>
          <StyledTokenWrapper>
            <Text variant="light">
              {tokenName} - {ratio}%
            </Text>
          </StyledTokenWrapper>
        </StyledRow>
        <StyledRow>
          <Text type="caption" variant="light" color="gray">
            Total available:{' '}
            <StyledSpanForBalance>{balance}</StyledSpanForBalance>
          </Text>
        </StyledRow>
      </StyledDivForInfo>

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
    </StyledInputBox>
  )
}

const StyledInputBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${colorTokens.white};
  border-radius: 16px;
  padding: 18px 24px;
  margin-bottom: 12px;
`

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  &:not(&:first-child) {
    padding-top: 8px;
  }
`

const StyledDivForInfo = styled.div``

const StyledTokenWrapper = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-transform: uppercase;
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

const StyledSpanForBalance = styled.span`
  color: ${colorTokens.black};
`
