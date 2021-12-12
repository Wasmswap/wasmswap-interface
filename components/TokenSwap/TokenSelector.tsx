import { useTokenBalance } from '../../hooks/useTokenBalance'
import { styled } from '@stitches/react'
import { useTokenInfo } from '../../hooks/useTokenInfo'
import { Text } from '../Text'
import { Chevron } from '../../icons/Chevron'
import { IconWrapper } from '../IconWrapper'
import { formatTokenBalance } from '../../util/conversion'
import { Button } from '../Button'
import React, { useState } from 'react'
import { TokenOptionsList } from './TokenOptionsList'
import { Union } from '../../icons/Union'

type TokenSelectorProps = {
  tokenSymbol: string
  amount: number
  onChange: (token: { tokenSymbol; amount }) => void
}

export const TokenSelector = ({
  tokenSymbol,
  amount,
  onChange,
}: TokenSelectorProps) => {
  const [isTokenListShowing, setTokenListShowing] = useState(false)

  const { balance: availableAmount /*isLoading*/ } =
    useTokenBalance(tokenSymbol)

  const formattedAvailableAmount = formatTokenBalance(availableAmount)
  const formattedAmount = formatTokenBalance(amount)

  const { logoURI } = useTokenInfo(tokenSymbol)

  function handleAmountChange({ target: { value } }) {
    onChange({ tokenSymbol, amount: Number(value) })
  }

  function handleApplyMaxAmount() {
    onChange({ tokenSymbol, amount: availableAmount })
  }

  function handleSelectTokenSymbol(selectedTokenSymbol: string) {
    onChange({ tokenSymbol: selectedTokenSymbol, amount })
    setTokenListShowing(false)
  }

  return (
    <>
      <StyledDivForWrapper>
        <StyledDivForSelector
          state={isTokenListShowing ? 'selecting' : 'selected'}
          onClick={() => setTokenListShowing((isShowing) => !isShowing)}
          role="button"
        >
          {isTokenListShowing && (
            <>
              <Text type="caption" variant="bold">
                Select a token
              </Text>
              <IconWrapper size="16px" rotation="90deg" icon={<Chevron />} />
            </>
          )}
          {!isTokenListShowing && (
            <>
              <StyledImgForTokenLogo src={logoURI} alt={tokenSymbol} />
              <div>
                <Text type="caption" variant="bold">
                  {tokenSymbol}
                </Text>
                <Text type="caption" variant="bold" color="tertiaryText">
                  {formattedAvailableAmount} available
                </Text>
              </div>
              <IconWrapper size="16px" rotation="-90deg" icon={<Chevron />} />
            </>
          )}
        </StyledDivForSelector>
        <StyledDivForAmountWrapper>
          {isTokenListShowing && (
            <IconWrapper
              type="button"
              onClick={() => setTokenListShowing(false)}
              icon={<Union />}
            />
          )}
          {!isTokenListShowing && (
            <>
              <StyledButton onClick={handleApplyMaxAmount}>
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
                  onChange={tokenSymbol ? handleAmountChange : undefined}
                  autoComplete="off"
                  readOnly={!tokenSymbol}
                  style={{ width: `${String(formattedAmount).length + 1}ch` }}
                />
              </Text>
            </>
          )}
        </StyledDivForAmountWrapper>
      </StyledDivForWrapper>
      {isTokenListShowing && (
        <StyledDivForTokensListWrapper>
          <TokenOptionsList
            activeTokenSymbol={tokenSymbol}
            onSelect={handleSelectTokenSymbol}
          />
        </StyledDivForTokensListWrapper>
      )}
    </>
  )
}

const StyledDivForWrapper = styled('div', {
  padding: '10px 14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const StyledDivForAmountWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
})

const StyledDivForSelector = styled('div', {
  cursor: 'pointer',
  display: 'grid',
  alignItems: 'center',
  backgroundColor: 'rgba(25, 29, 32, 0)',
  borderRadius: '6px',
  transition: 'background-color .1s ease-out',
  maxWidth: 231,
  userSelect: 'none',
  '&:hover': {
    backgroundColor: 'rgba(25, 29, 32, 0.1)',
  },
  variants: {
    state: {
      selected: {
        padding: '8px 12px',
        columnGap: '12px',
        gridTemplateColumns: '30px 1fr 16px',
      },
      selecting: {
        backgroundColor: 'rgba(25, 29, 32, 0.1)',
        padding: '12px 16px',
        columnGap: '8px',
        gridTemplateColumns: '1fr 16px',
      },
    },
  },
})

const StyledImgForTokenLogo = styled('img', {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
})

const StyledButton = styled('button', {
  padding: '8px 12px',
  backgroundColor: 'rgba(25, 29, 32, 0.1)',
  borderRadius: '38px',
  marginRight: 20,
})

const StyledInput = styled('input', { width: 'auto', textAlign: 'right' })

const StyledDivForTokensListWrapper = styled('div', {
  padding: '0 12px',
})
