import React, { FC } from 'react'
import { Button } from './Button'
import styled from 'styled-components'
import { Spinner } from './Spinner'

type SwapButtonProps = {
  isLoading: boolean
  isActive?: boolean
  onClick: () => void
  label: string
}

export const SwapButton: FC<SwapButtonProps> = ({
  isLoading,
  isActive = true,
  onClick,
  label,
}) => (
  <StyledButtonWrapper>
    <Button
      size="humongous"
      onClick={isLoading ? undefined : onClick}
      disabled={!isActive || isLoading}
      type="submit"
    >
      {isLoading ? <Spinner /> : label}
    </Button>
  </StyledButtonWrapper>
)

export const StyledButtonWrapper = styled.div`
  padding: 18px 0 32px;
  &:not(&:last-child) {
    padding-bottom: 0;
  }
`
