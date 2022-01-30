import mergeRefs from 'react-merge-refs'
import { useTokenBalance } from 'hooks/useTokenBalance'
import { styled } from 'components/theme'
import { IconWrapper } from 'components/IconWrapper'
import React, { useRef, useState } from 'react'
import { TokenOptionsList } from './TokenOptionsList'
import { Union } from 'icons/Union'
import { Inline } from '../../../components/Inline'
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
  size?: 'small' | 'large'
}

export const TokenSelector = ({
  readOnly,
  disabled,
  tokenSymbol,
  amount,
  onChange,
  size = 'large',
}: TokenSelectorProps) => {
  const wrapperRef = useRef<HTMLDivElement>()
  const inputRef = useRef<HTMLInputElement>()

  const [refForInput, { isFocused: isInputFocused }] = useIsInteracted()

  const [isTokenListShowing, setTokenListShowing] = useState(false)
  const { balance: availableAmount } = useTokenBalance(tokenSymbol)

  const shouldShowConvenienceBalanceButtons =
    !isTokenListShowing && tokenSymbol && !readOnly && availableAmount > 0

  const handleAmountChange = (amount) => onChange({ tokenSymbol, amount })
  const handleSelectToken = (selectedTokenSymbol) => {
    onChange({ tokenSymbol: selectedTokenSymbol, amount })
    setTokenListShowing(false)
  }

  useOnClickOutside(wrapperRef, () => {
    setTokenListShowing(false)
  })

  if (size === 'small') {
    return (
      <StyledDivForContainer ref={wrapperRef}>
        <Inline css={{ padding: '$6 $4', display: 'grid' }}>
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
        </Inline>
        {!isTokenListShowing && (
          <Inline
            justifyContent={
              shouldShowConvenienceBalanceButtons ? 'space-between' : 'flex-end'
            }
            css={{
              padding: shouldShowConvenienceBalanceButtons
                ? '$4 $12 $10 $11'
                : '$6 $12 $12 $11',
            }}
            onClick={() => {
              inputRef.current.focus()
            }}
          >
            {shouldShowConvenienceBalanceButtons && (
              <ConvenienceBalanceButtons
                tokenSymbol={tokenSymbol}
                availableAmount={availableAmount}
                onChange={handleAmountChange}
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
          </Inline>
        )}
        {isTokenListShowing && (
          <TokenOptionsList
            activeTokenSymbol={tokenSymbol}
            onSelect={handleSelectToken}
            css={{ padding: '$1 $6 $12' }}
            visibleNumberOfTokensInViewport={4.5}
          />
        )}
      </StyledDivForContainer>
    )
  }

  return (
    <StyledDivForContainer selected={isInputFocused} ref={wrapperRef}>
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
          {shouldShowConvenienceBalanceButtons && (
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
          onSelect={handleSelectToken}
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
  borderRadius: '$2',
  transition: 'box-shadow .1s ease-out',
  variants: {
    selected: {
      true: {
        boxShadow: '0 0 0 $space$1 $borderColors$selected',
      },
      false: {
        boxShadow: '0 0 0 $space$1 $colors$dark0',
      },
    },
  },
  [`&:first-of-type ${StyledDivForOverlay}`]: {
    borderTopLeftRadius: '$2',
    borderTopRightRadius: '$2',
  },
  [`&:last-of-type ${StyledDivForOverlay}`]: {
    borderBottomLeftRadius: '$2',
    borderBottomRightRadius: '$2',
  },
})
