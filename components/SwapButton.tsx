import Image from 'next/image'
import React from 'react'
import { Button } from './Button'
import styled from 'styled-components'

export const SwapButton = ({
  isLoading,
  onClick,
}: {
  isLoading: boolean
  onClick: () => void
}) => (
  <StyledButtonWrapper>
    <Button
      size="humongous"
      onClick={isLoading ? undefined : onClick}
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
        'Swap'
      )}
    </Button>
  </StyledButtonWrapper>
)

export const StyledButtonWrapper = styled.div`
  padding: 18px 0 32px;
`
