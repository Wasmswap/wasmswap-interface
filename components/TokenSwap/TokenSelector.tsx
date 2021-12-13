import { useTokenBalance } from '../../hooks/useTokenBalance'
import { styled } from '@stitches/react'
import { IconWrapper } from '../IconWrapper'
import React, { useRef, useState } from 'react'
import { TokenOptionsList } from './TokenOptionsList'
import { Union } from '../../icons/Union'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { SelectorToggle } from './SelectorToggle'
import { SelectorInput } from './SelectorInput'

type TokenSelectorProps = {
  readOnly?: boolean
  amount: number
  tokenSymbol: string
  onChange: (token: { tokenSymbol; amount }) => void
}

export const TokenSelector = ({
  readOnly,
  tokenSymbol,
  amount,
  onChange,
}: TokenSelectorProps) => {
  const wrapperRef = useRef()
  const [isTokenListShowing, setTokenListShowing] = useState(false)
  const { balance: availableAmount } = useTokenBalance(tokenSymbol)

  useOnClickOutside(wrapperRef, () => {
    setTokenListShowing(false)
  })

  return (
    <div ref={wrapperRef} data-token-selector="">
      <StyledDivForWrapper>
        <SelectorToggle
          availableAmount={availableAmount}
          tokenSymbol={tokenSymbol}
          isSelecting={isTokenListShowing}
          onToggle={() => setTokenListShowing((isShowing) => !isShowing)}
        />
        <StyledDivForAmountWrapper>
          {isTokenListShowing && (
            <IconWrapper
              type="button"
              onClick={() => setTokenListShowing(false)}
              icon={<Union />}
            />
          )}
          {!isTokenListShowing && (
            <SelectorInput
              amount={amount}
              disabled={!tokenSymbol || readOnly}
              onAmountChange={(amount) => onChange({ tokenSymbol, amount })}
              onMaxAmountApply={() => {
                onChange({ tokenSymbol, amount: availableAmount })
              }}
            />
          )}
        </StyledDivForAmountWrapper>
      </StyledDivForWrapper>
      {isTokenListShowing && (
        <StyledDivForTokensListWrapper>
          <TokenOptionsList
            activeTokenSymbol={tokenSymbol}
            onSelect={(selectedTokenSymbol) => {
              onChange({ tokenSymbol: selectedTokenSymbol, amount })
              setTokenListShowing(false)
            }}
          />
        </StyledDivForTokensListWrapper>
      )}
    </div>
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

const StyledDivForTokensListWrapper = styled('div', {
  padding: '2px 12px 24px',
})
