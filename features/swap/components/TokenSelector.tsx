import mergeRefs from 'react-merge-refs'
import { useTokenBalance } from 'hooks/useTokenBalance'
import { styled } from 'components/theme'
import { IconWrapper } from 'components/IconWrapper'
import React, { useRef, useState } from 'react'
import { TokenOptionsList } from './TokenOptionsList'
import { Union } from 'icons/Union'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { SelectorToggle } from './SelectorToggle'
import { SelectorInput } from './SelectorInput'
import { ConvenienceBalanceButtons } from './ConvenienceBalanceButtons'
import { useIsInteracted } from 'hooks/useIsInteracted'
import { Button } from 'components/Button'

type TokenSelectorProps = {
  readOnly?: boolean
  disabled?: boolean
  amount: number
  tokenSymbol: string
  onChange: (token: { tokenSymbol; amount }) => void
}

export const TokenSelector = ({
  readOnly,
  disabled,
  tokenSymbol,
  amount,
  onChange,
}: TokenSelectorProps) => {
  const wrapperRef = useRef<HTMLDivElement>()
  const inputRef = useRef<HTMLInputElement>()

  const [refForInput, { isFocused: isInputFocused }] = useIsInteracted()

  const [isTokenListShowing, setTokenListShowing] = useState(false)
  const { balance: availableAmount } = useTokenBalance(tokenSymbol)

  useOnClickOutside(wrapperRef, () => {
    setTokenListShowing(false)
  })

  const handleAmountChange = (amount) => onChange({ tokenSymbol, amount })

  return (
    <StyledDivForContainer ref={wrapperRef}>
      <StyledDivForWrapper>
        <StyledDivForSelector>
          <SelectorToggle
            availableAmount={availableAmount}
            tokenSymbol={tokenSymbol}
            isSelecting={isTokenListShowing}
            onToggle={
              !disabled
                ? () => setTokenListShowing((isShowing) => !isShowing)
                : undefined
            }
          />
          {!isTokenListShowing && tokenSymbol && !readOnly && (
            <ConvenienceBalanceButtons
              disabled={availableAmount <= 0}
              tokenSymbol={tokenSymbol}
              availableAmount={availableAmount}
              onChange={!disabled ? handleAmountChange : () => {}}
            />
          )}
        </StyledDivForSelector>
        <StyledDivForAmountWrapper>
          {isTokenListShowing && (
            <Button
              icon={<IconWrapper icon={<Union />} />}
              variant="ghost"
              onClick={() => setTokenListShowing(false)}
              css={{
                '& svg': {
                  color: '$colors$tertiary',
                },
              }}
            />
          )}
          {!isTokenListShowing && (
            <SelectorInput
              inputRef={mergeRefs([inputRef, refForInput])}
              amount={amount}
              disabled={!tokenSymbol || readOnly || disabled}
              onAmountChange={handleAmountChange}
            />
          )}
        </StyledDivForAmountWrapper>
        <StyledDivForOverlay
          interactive={readOnly ? false : !isInputFocused}
          onClick={() => {
            if (!readOnly) {
              if (isTokenListShowing) {
                setTokenListShowing(false)
              } else {
                inputRef.current?.focus()
              }
            }
          }}
        />
      </StyledDivForWrapper>
      {isTokenListShowing && (
        <TokenOptionsList
          activeTokenSymbol={tokenSymbol}
          onSelect={(selectedTokenSymbol) => {
            onChange({ tokenSymbol: selectedTokenSymbol, amount })
            setTokenListShowing(false)
          }}
          css={{ padding: '$1 $6 $12' }}
        />
      )}
    </StyledDivForContainer>
  )
}

const StyledDivForWrapper = styled('div', {
  padding: '$5 $15 $5 $7',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative',
  zIndex: 0,
})

const StyledDivForSelector = styled('div', {
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  zIndex: 1,
})

const StyledDivForAmountWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  position: 'relative',
  zIndex: 1,
})

const StyledDivForOverlay = styled('div', {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
  backgroundColor: '$colors$dark0',
  transition: 'background-color .1s ease-out',
  variants: {
    interactive: {
      true: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '$colors$dark5',
        },
      },
    },
  },
})

const StyledDivForContainer = styled('div', {
  [`&:first-of-type ${StyledDivForOverlay}`]: {
    borderTopLeftRadius: '$2',
    borderTopRightRadius: '$2',
  },
  [`&:last-of-type ${StyledDivForOverlay}`]: {
    borderBottomLeftRadius: '$2',
    borderBottomRightRadius: '$2',
  },
})
