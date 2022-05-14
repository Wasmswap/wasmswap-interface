import {
  BasicNumberInput,
  Button,
  ButtonForWrapper,
  formatTokenBalance,
  styled,
  Text,
  useTriggerInputFocus,
} from 'junoblocks'

type AmountInputProps = {
  amount: number
  maxApplicableAmount: number
  onAmountChange: (amount: number) => void
}

export const AmountInput = ({
  amount,
  maxApplicableAmount,
  onAmountChange,
}: AmountInputProps) => {
  const { isFocused, bind } = useTriggerInputFocus()

  return (
    <StyledButtonForWrapper
      variant="secondary"
      selected={isFocused}
      {...bind.button}
    >
      <StyledDivForButtons>
        <Button
          onClick={() => onAmountChange(maxApplicableAmount)}
          variant="secondary"
          size="small"
        >
          Max
        </Button>
        <Button
          onClick={() => onAmountChange(maxApplicableAmount / 2)}
          variant="secondary"
          size="small"
        >
          1/2
        </Button>
      </StyledDivForButtons>
      <StyledDivForInputWrapper>
        <Text variant="primary" align="right">
          <BasicNumberInput
            value={Number(formatTokenBalance(amount))}
            min={0}
            max={maxApplicableAmount}
            onChange={onAmountChange}
            {...bind.input}
          />
        </Text>
      </StyledDivForInputWrapper>
    </StyledButtonForWrapper>
  )
}

const StyledButtonForWrapper = styled(ButtonForWrapper, {
  padding: '$8 $12 $8 $8 !important',
})

const StyledDivForButtons = styled('div', {
  columnGap: '$space$4',
  display: 'flex',
  alignItems: 'center',
})

const StyledDivForInputWrapper = styled('div', {})
