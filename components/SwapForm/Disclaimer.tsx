import React, { useState, useEffect, ReactNode, FC } from 'react'
import styled from 'styled-components'
import { Text } from '../Text'
import { swapFormSize } from './SwapFormStyles'

type DisclaimerProps = {
  children: ReactNode
  delayMs: number
}

export const Disclaimer: FC<DisclaimerProps> = ({ children, delayMs }) => {
  const [isShowing, setShowing] = useState(false)

  useEffect(() => {
    let timeout = setTimeout(() => {
      setShowing(true)
    }, delayMs)

    return () => {
      setShowing(false)
      clearTimeout(timeout)
    }
  }, [delayMs])

  return (
    <StyledDiv $isShowing={isShowing}>
      {typeof children === 'string' ? (
        <Text type="caption" variant="light" color="gray">
          {children}
        </Text>
      ) : (
        children
      )}
    </StyledDiv>
  )
}

const StyledDiv = styled.div<{ $isShowing: boolean }>`
  ${swapFormSize};
  margin: 0 auto;
  transition: opacity 0.65s ease-out;
  opacity: ${(p) => (p.$isShowing ? 1 : 0)};
  padding: 12px 0;
`
