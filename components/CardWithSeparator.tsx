import { ReactElement, Children } from 'react'
import { colorTokens } from '../util/constants'
import styled from 'styled-components'

type CardWithSeparatorProps = {
  children: ReactElement[]
}

export const CardWithSeparator = ({ children }: CardWithSeparatorProps) => {
  return (
    <StyledWrapper>
      {Children.map(children, (child, idx) => (
        <StyledContent $enableSeparator={idx !== children.length - 1}>
          {child}
        </StyledContent>
      ))}
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  border-radius: 16px;
  border: 1px solid #e7e7e7;
  background-color: ${colorTokens.white};
  min-width: 280px;
  padding: 12px 0 18px;
`

const StyledContent = styled.div`
  width: 100%;
  padding: 0 18px;
  border-bottom: ${(p) => (p.$enableSeparator ? '1px solid #E6E6E6' : 'none')};
`
