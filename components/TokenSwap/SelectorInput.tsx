import { Text } from '../Text'
import React from 'react'
import { styled } from '@stitches/react'
import { formatTokenBalance } from '../../util/conversion'

type SelectorInputProps = {
  amount: number
  disabled: boolean
  onAmountChange: (amount: number) => void
  onMaxAmountApply: () => void
}

export const SelectorInput = ({
  amount,
  disabled,
  onAmountChange,
  onMaxAmountApply,
}: SelectorInputProps) => {
  const formattedAmount = formatTokenBalance(amount)

  const handleAmountChange = ({ target: { value } }) => {
    onAmountChange(Number(value))
  }

  return (
    <>
      <StyledButton onClick={onMaxAmountApply}>
        <Text type="subtitle" variant="light">
          Max
        </Text>
      </StyledButton>
      <Text variant="bold">
        <StyledInput
          type="number"
          // todo: sort out accessibility
          // name="token-amount"
          // id="token-amount"
          placeholder="0.0"
          min={0}
          value={formattedAmount}
          onChange={!disabled ? handleAmountChange : undefined}
          autoComplete="off"
          readOnly={disabled}
          style={{ width: `${String(formattedAmount).length + 1}ch` }}
        />
      </Text>
    </>
  )
}

const StyledButton = styled('button', {
  padding: '8px 12px',
  backgroundColor: 'rgba(25, 29, 32, 0.1)',
  borderRadius: '38px',
  marginRight: 20,
})

const StyledInput = styled('input', { width: 'auto', textAlign: 'right' })
