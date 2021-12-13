import { Text } from '../Text'
import { IconWrapper } from '../IconWrapper'
import { Chevron } from '../../icons/Chevron'
import React from 'react'
import { formatTokenBalance } from '../../util/conversion'
import { styled } from '@stitches/react'
import { useTokenInfo } from '../../hooks/useTokenInfo'

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
  const formattedAvailableAmount = formatTokenBalance(availableAmount)
  const { logoURI } = useTokenInfo(tokenSymbol) || {}

  const hasTokenSelected = Boolean(tokenSymbol)

  return (
    <StyledDivForSelector
      state={isSelecting ? 'selecting' : 'selected'}
      onClick={onToggle}
      role="button"
    >
      {(isSelecting || !hasTokenSelected) && (
        <>
          <Text type="caption" variant="bold">
            Select a token
          </Text>
          <IconWrapper size="16px" rotation="90deg" icon={<Chevron />} />
        </>
      )}
      {!isSelecting && hasTokenSelected && (
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
  )
}

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
        backgroundColor: 'rgba(25, 29, 32, 0.05)',
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
