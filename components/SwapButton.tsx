import Image from 'next/image'
import React, { FC } from 'react'
import { Button } from './Button'
import styled from 'styled-components'

type SwapButtonProps = {
  isLoading: boolean
  isActive: boolean
  onClick: () => void
  label: string
}

export const SwapButton: FC<SwapButtonProps> = ({
  isLoading,
  isActive,
  onClick,
  label,
}) => (
  <StyledButtonWrapper>
    <Button
      size="humongous"
      onClick={isLoading ? undefined : onClick}
      disabled={!isActive}
      type="submit"
    >
      {isLoading ? (
        <Image
          src={'/spinner.svg' as any}
          alt="loading"
          className="h-6 animate-spin"
          width={24}
          height={24}
        />
      ) : (
        label
      )}
    </Button>
  </StyledButtonWrapper>
)

export const StyledButtonWrapper = styled.div`
  padding: 18px 0 32px;
  &:not(&:last-child) {
    padding-bottom: 0;
  }
`
