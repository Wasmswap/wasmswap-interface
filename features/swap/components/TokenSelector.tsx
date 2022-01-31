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
import { Button } from 'components/Button'
import { QueryInput } from './QueryInput'

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

  const [isTokenListShowing, setTokenListShowing] = useState(false)

  const { balance: availableAmount } = useTokenBalance(tokenSymbol)
  const [tokenSearchQuery, setTokenSearchQuery] = useState('')
  const [isInputForSearchFocused, setInputForSearchFocused] = useState(false)
  const [isInputForAmountFocused, setInputForAmountFocused] = useState(false)

  const shouldShowConvenienceBalanceButtons = Boolean(
    !isTokenListShowing && tokenSymbol && !readOnly && availableAmount > 0
  )

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
      <StyledDivForContainer
        selected={isInputForSearchFocused}
        ref={wrapperRef}
      >
        {isTokenListShowing && (
          <Inline justifyContent="space-between" css={{ padding: '$5 $6' }}>
            <QueryInput
              searchQuery={tokenSearchQuery}
              onQueryChange={setTokenSearchQuery}
              onFocus={() => {
                setInputForSearchFocused(true)
              }}
              onBlur={() => {
                setInputForSearchFocused(false)
              }}
            />
            <Button
              icon={<IconWrapper icon={<Union />} />}
              variant="ghost"
              onClick={() => setTokenListShowing(false)}
              iconColor="tertiary"
            />
          </Inline>
        )}
        {!isTokenListShowing && (
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
        )}
        {!isTokenListShowing && (
          <StyledInlineForInputWrapper
            rendersButtons={shouldShowConvenienceBalanceButtons}
            selected={readOnly ? false : isInputForAmountFocused}
            onClick={() => {
              inputRef.current.focus()
            }}
          >
            {shouldShowConvenienceBalanceButtons && (
              <Inline gap={4}>
                <ConvenienceBalanceButtons
                  tokenSymbol={tokenSymbol}
                  availableAmount={availableAmount}
                  onChange={handleAmountChange}
                />
              </Inline>
            )}
            <SelectorInput
              inputRef={inputRef}
              amount={amount}
              disabled={!tokenSymbol || readOnly || disabled}
              onAmountChange={handleAmountChange}
              onFocus={() => {
                setInputForAmountFocused(true)
              }}
              onBlur={() => {
                setInputForAmountFocused(false)
              }}
            />
          </StyledInlineForInputWrapper>
        )}
        {isTokenListShowing && (
          <TokenOptionsList
            activeTokenSymbol={tokenSymbol}
            onSelect={handleSelectToken}
            css={{ padding: '$1 $6 $12' }}
            queryFilter={tokenSearchQuery}
            emptyStateLabel={`No result for “${tokenSearchQuery}”`}
            visibleNumberOfTokensInViewport={4.5}
          />
        )}
      </StyledDivForContainer>
    )
  }

  return (
    <StyledDivForContainer
      selected={isInputForAmountFocused || isInputForSearchFocused}
      ref={wrapperRef}
    >
      <StyledDivForWrapper>
        <StyledDivForSelector>
          {isTokenListShowing && (
            <QueryInput
              searchQuery={tokenSearchQuery}
              onQueryChange={setTokenSearchQuery}
              onFocus={() => {
                setInputForSearchFocused(true)
              }}
              onBlur={() => {
                setInputForSearchFocused(false)
              }}
            />
          )}
          {!isTokenListShowing && (
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
          )}
          {shouldShowConvenienceBalanceButtons && (
            <Inline gap={4} css={{ paddingLeft: '$8' }}>
              <ConvenienceBalanceButtons
                disabled={availableAmount <= 0}
                tokenSymbol={tokenSymbol}
                availableAmount={availableAmount}
                onChange={!disabled ? handleAmountChange : () => {}}
              />
            </Inline>
          )}
        </StyledDivForSelector>
        <StyledDivForAmountWrapper>
          {isTokenListShowing && (
            <Button
              icon={<IconWrapper icon={<Union />} />}
              variant="ghost"
              onClick={() => setTokenListShowing(false)}
              iconColor="tertiary"
            />
          )}
          {!isTokenListShowing && (
            <SelectorInput
              inputRef={inputRef}
              amount={amount}
              disabled={!tokenSymbol || readOnly || disabled}
              onAmountChange={handleAmountChange}
              onFocus={() => {
                setInputForAmountFocused(true)
              }}
              onBlur={() => {
                setInputForAmountFocused(false)
              }}
            />
          )}
        </StyledDivForAmountWrapper>
        <StyledDivForOverlay
          interactive={readOnly ? false : !isInputForAmountFocused}
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
          queryFilter={tokenSearchQuery}
          css={{ padding: '$1 $6 $12' }}
          emptyStateLabel={`No result for “${tokenSearchQuery}”`}
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

const selectedVariantForInputWrapper = {
  true: {
    boxShadow: '0 0 0 $space$1 $borderColors$selected',
  },
  false: {
    boxShadow: '0 0 0 $space$1 $colors$dark0',
  },
}

const StyledDivForContainer = styled('div', {
  borderRadius: '$2',
  transition: 'box-shadow .1s ease-out',
  variants: {
    selected: selectedVariantForInputWrapper,
  },
})

const StyledInlineForInputWrapper = styled('div', {
  borderRadius: '$2',
  transition: 'box-shadow .1s ease-out',
  display: 'flex',
  alignItems: 'center',

  variants: {
    selected: selectedVariantForInputWrapper,

    rendersButtons: {
      true: {
        justifyContent: 'space-between',
        padding: '$10 $12',
      },
      false: {
        justifyContent: 'flex-end',
        padding: '$13 $12',
      },
    },
  },
})
