import React from 'react'
import { Text } from 'components/Text'
import { styled } from '@stitches/react'
import { useAmountChangeController } from '../../../hooks/useAmountChangeController'

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
  const { value, setValue } = useAmountChangeController({
    amount,
    onAmountChange,
  })

  return (
    <Text variant="bold">
      <StyledInput
        type="number"
        placeholder="0.0"
        min={0}
        value={value}
        onChange={
          !disabled ? ({ target: { value } }) => setValue(value) : undefined
        }
        autoComplete="off"
        readOnly={disabled}
        style={{ width: `${value.length + 1}ch` }}
      />
    </Text>
  )
}

const StyledInput = styled('input', { width: 'auto', textAlign: 'right' })
