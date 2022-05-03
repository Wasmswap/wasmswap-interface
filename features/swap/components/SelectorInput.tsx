import {
  calculateCharactersLength,
  styled,
  Text,
  useAmountChangeController,
} from 'junoblocks'
import React, { HTMLProps, Ref } from 'react'

type SelectorInputProps = {
  amount: number
  disabled: boolean
  onAmountChange: (amount: number) => void
  inputRef?: Ref<HTMLInputElement>
} & Omit<HTMLProps<HTMLInputElement>, 'ref'>

export const SelectorInput = ({
  amount,
  disabled,
  onAmountChange,
  inputRef,
  ...inputProps
}: SelectorInputProps) => {
  const { value, setValue } = useAmountChangeController({
    amount,
    onAmountChange,
  })

  return (
    <Text variant="primary">
      <StyledInput
        ref={inputRef}
        type="number"
        lang="en-US"
        placeholder="0.0"
        min={0}
        value={value}
        onChange={
          !disabled ? ({ target: { value } }) => setValue(value) : undefined
        }
        autoComplete="off"
        readOnly={disabled}
        style={{ width: `${calculateCharactersLength(value)}ch` }}
        {...inputProps}
      />
    </Text>
  )
}

const StyledInput = styled('input', {
  width: 'auto',
  textAlign: 'right',
  color: 'inherit',
})
