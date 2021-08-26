import React, { FC } from 'react'
import styled from 'styled-components'
import { Text } from './Text'

type TokenSelectorProps = {
  amount: number
  balance?: number
  blockedTokenSymbol?: string
  tokensList: Array<{ symbol: string; [k: string]: any }>
  tokenName: string
  onAmountChange?: (amount: number) => void
  onTokenNameSelect: (tokenName: string) => void
  onApplyMaxBalanceClick?: () => void
}

export const TokenSelector: FC<TokenSelectorProps> = ({
  balance,
  tokensList,
  amount,
  tokenName,
  blockedTokenSymbol,
  onAmountChange,
  onTokenNameSelect,
  onApplyMaxBalanceClick,
}) => {
  const handleAmountChange = ({ target: { value } }) =>
    onAmountChange(Number(value))
  const handleTokenNameSelect = ({ target: { value } }) =>
    onTokenNameSelect(value)

  return (
    <StyledInputBox>
      <StyledRow>
        <StyledTokenWrapper>
          <label htmlFor="token-a" hidden>
            Token
          </label>
          <Text variant="light">{tokenName}</Text>
          <StyledSelect
            id="token-a"
            name="token-a"
            onChange={handleTokenNameSelect}
            value={tokenName}
          >
            {tokensList.map((value, key) => (
              <option key={key} disabled={blockedTokenSymbol === value.symbol}>
                {value.symbol}
              </option>
            ))}
          </StyledSelect>
        </StyledTokenWrapper>
        <Text>
          <StyledInput
            type="number"
            name="token-a-amount"
            id="token-a-amount"
            placeholder="0.0"
            min={0}
            value={amount}
            onChange={onAmountChange ? handleAmountChange : undefined}
            autoComplete="off"
            readOnly={!onAmountChange}
          />
        </Text>
      </StyledRow>

      {typeof balance === 'number' && (
        <StyledRow>
          <StyledSubRow>
            <Text type="caption" variant="light" color="gray">
              Balance: {balance} {tokenName}
            </Text>
            {Boolean(onApplyMaxBalanceClick) && (
              <StyledLink onClick={onApplyMaxBalanceClick}>(Max)</StyledLink>
            )}
          </StyledSubRow>

          <Text type="caption" variant="light" color="gray">
            $0.00
          </Text>
        </StyledRow>
      )}
    </StyledInputBox>
  )
}

const StyledInputBox = styled.div`
  background-color: #fafafa;
  border-radius: 16px;
  padding: 20px 18px;
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
  background-color: #fff;
  border-radius: 12px;
  position: relative;
  padding: 8px 12px;
`

const StyledSelect = styled.select`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const StyledInput = styled.input`
  border: none;
  outline: none;
  display: inline;
  font-family: inherit;
  font-size: inherit;
  padding: 0;
  width: auto;
  background: transparent;
  text-align: right;
`

const StyledLink = styled(Text).attrs(() => ({
  variant: 'light',
  type: 'caption',
  color: 'light-blue',
}))`
  margin-left: 4px;
  cursor: pointer;
  user-select: none;
  transition: opacity 0.1s ease-out;
  &:hover {
    opacity: 0.75;
  }
`
