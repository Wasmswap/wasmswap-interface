import styled from 'styled-components'
import { colorTokens } from '../util/constants'
import { Text } from './Text'
import { Button } from './Button'
import { BasicNumberInput } from './BasicNumberInput'

type TokenAmountInputProps = {
  amount: number
  onAmountChange: (amount: number) => void
  maxAmount: number
  tokenSymbol: string
}

export const TokenAmountInput = ({
  amount,
  onAmountChange,
  maxAmount,
  tokenSymbol,
}: TokenAmountInputProps) => {
  return (
    <StyledWrapper>
      <Button size="small" onClick={() => onAmountChange(maxAmount)}>
        Max
      </Button>
      <Text as={StyledDivForInputWrapper} variant="hero">
        <BasicNumberInput
          value={amount}
          min={0}
          max={maxAmount}
          onChange={onAmountChange}
          lang="en-US"
          placeholder="0.00"
        />
        <StyledDivForTokenName>
          <Text variant="caption">{tokenSymbol}</Text>
        </StyledDivForTokenName>
      </Text>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  border: 1px solid ${colorTokens.black};
  padding: 12px 22px 12px 20px;
`

const StyledDivForInputWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  flex-grow: 1;
`

const StyledDivForTokenName = styled.div`
  display: flex;
  padding: 8px 0 0 8px;
  line-height: 44px;
`
