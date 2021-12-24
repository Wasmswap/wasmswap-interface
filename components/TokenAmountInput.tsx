import styled from 'styled-components'
import { colorTokens } from '../util/constants'
import { formatTokenBalance } from '../util/conversion'
import { Text } from './Text'
import { Button } from './Button'

type TokenAmountInputProps = {
  value: number
  onAmountChange: (amount: number) => void
  maxValue: number
  tokenSymbol: string
}

export const TokenAmountInput = ({
  value,
  onAmountChange,
  maxValue,
  tokenSymbol,
}: TokenAmountInputProps) => {
  function handleChange({ target: { value: rawInput } }) {
    const formattedValue = formatTokenBalance(rawInput)
    const validatedValue = formattedValue > maxValue ? maxValue : formattedValue
    onAmountChange(Number(validatedValue))
  }

  return (
    <StyledWrapper>
      <StyledButton size="small" onClick={() => onAmountChange(maxValue)}>
        Max
      </StyledButton>
      <Text as={StyledDivForInputWrapper} type="title" variant="bold">
        <StyledInput
          value={formatTokenBalance(value)}
          onChange={handleChange}
          type="number"
          max={maxValue}
          min={0}
          placeholder="0.00"
        />
        <StyledDivForTokenName>
          <Text type="microscopic" variant="bold">
            {tokenSymbol}
          </Text>
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

const StyledInput = styled.input`
  border: none;
  outline: none;
  display: block;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  background: transparent;
  text-align: right;
  line-height: 44px;
  flex: 1;
  padding: 0;
  border-radius: 0;
  margin: 0;
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

const StyledButton = styled(Button)`
  border-radius: 136px;
  padding: 6px 11px;
`
