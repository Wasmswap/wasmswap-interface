import { Text } from '../../Text'
import React from 'react'
import { styled } from '@stitches/react'
import { formatTokenBalance } from '../../../util/conversion'

type SelectorInputProps = {
  amount: number
  disabled: boolean
  onAmountChange: (amount: number) => void
}

export const SelectorInput = ({
  amount,
  disabled,
  onAmountChange,
}: SelectorInputProps) => {
  const formattedAmount = formatTokenBalance(amount)

  const handleAmountChange = ({ target: { value } }) => {
    onAmountChange(formatTokenBalance(value))
  }

  return (
    <Text variant="bold">
      <StyledInput
        type="number"
        // todo: sort out accessibility
        // name="token-amount"
        // id="token-amount"
        placeholder="0.0"
        min={0}
        value={String(formattedAmount)}
        onChange={!disabled ? handleAmountChange : undefined}
        autoComplete="off"
        readOnly={disabled}
        style={{ width: `${String(formattedAmount).length + 1}ch` }}
      />
    </Text>
  )
}

const StyledInput = styled('input', { width: 'auto', textAlign: 'right' })
