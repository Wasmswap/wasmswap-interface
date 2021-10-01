import React, { FC } from 'react'
import styled from 'styled-components'
import { Text } from './Text'

type RemoveLiquidityInputProps = {
  value: number
  onChangeValue: (value: number) => void
}

export const RemoveLiquidityInput: FC<RemoveLiquidityInputProps> = ({
  value,
  onChangeValue,
}) => {
  const handleChange = ({ target: { value } }) => {
    const amount = Math.min(parseFloat(value), 100)
    onChangeValue(amount % 1 > 0 ? Number(amount.toFixed(2)) : amount)
  }

  return (
    <StyledInputBox>
      <Text>
        <StyledInput
          type="number"
          placeholder=""
          min={0}
          max={100}
          value={value}
          onChange={onChangeValue ? handleChange : undefined}
          autoComplete="off"
          readOnly={!onChangeValue}
        />
      </Text>
      <Text>%</Text>
    </StyledInputBox>
  )
}

const inputWidth = 100

const StyledInputBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e8e8e8;
  border-radius: 16px;
  padding: 18px ${inputWidth}px 18px 24px;
  margin-bottom: 12px;
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
  min-width: ${inputWidth}px;
`
