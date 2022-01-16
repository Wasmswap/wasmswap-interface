import { Text } from '../../../components/Text'
import { IconWrapper } from '../../../components/IconWrapper'
import { Chevron } from '../../../icons/Chevron'
import React from 'react'
import { formatTokenBalance } from '../../../util/conversion'
import { styled } from 'components/theme'
import { useTokenInfo } from '../../../hooks/useTokenInfo'

type SelectorToggleProps = {
  isSelecting: boolean
  onToggle: () => void
  tokenSymbol: string
  availableAmount: number
}

export const SelectorToggle = ({
  isSelecting,
  onToggle,
  availableAmount,
  tokenSymbol,
}: SelectorToggleProps) => {
  const formattedAvailableAmount = formatTokenBalance(availableAmount, {
    includeCommaSeparation: true,
  })

  const { logoURI } = useTokenInfo(tokenSymbol) || {}

  const hasTokenSelected = Boolean(tokenSymbol)

  return (
    <StyledDivForSelector
      state={isSelecting || !tokenSymbol ? 'selecting' : 'selected'}
      onClick={onToggle}
      role="button"
    >
      {(isSelecting || !hasTokenSelected) && (
        <>
          <Text variant="body">Select a token</Text>
          <IconWrapper
            size="24px"
            rotation={tokenSymbol ? '90deg' : '-90deg'}
            color="tertiary"
            icon={<Chevron />}
          />
        </>
      )}
      {!isSelecting && hasTokenSelected && (
        <>
          <StyledImgForTokenLogo
            as={logoURI ? 'img' : 'div'}
            src={logoURI}
            alt={tokenSymbol}
          />
          <div>
            <Text variant="body">{tokenSymbol}</Text>
            <Text variant="secondary">
              {formattedAvailableAmount} available
            </Text>
          </div>
          <IconWrapper
            size="16px"
            rotation="-90deg"
            color="tertiary"
            icon={<Chevron />}
          />
        </>
      )}
    </StyledDivForSelector>
  )
}

const StyledDivForSelector = styled('div', {
  cursor: 'pointer',
  display: 'grid',
  alignItems: 'center',
  backgroundColor: '$colors$dark0',
  borderRadius: '$1',
  transition: 'background-color .1s ease-out',
  userSelect: 'none',
  whiteSpace: 'pre',
  '&:hover': {
    backgroundColor: '$colors$dark10',
  },
  '&:active': {
    backgroundColor: '$colors$dark5',
  },
  variants: {
    state: {
      selected: {
        padding: '$4 $6',
        columnGap: '$space$6',
        gridTemplateColumns: '$space$15 1fr $space$8',
        minWidth: 231,
      },
      selecting: {
        margin: 'calc($space$2 * 0.85) 0',
        padding: '$space$6 $8',
        columnGap: '$space$4',
        gridTemplateColumns: '1fr $space$8',
      },
    },
  },
})

const StyledImgForTokenLogo = styled('img', {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  backgroundColor: '#ccc',
})
