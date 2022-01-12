import { ReactElement, Children } from 'react'
import { colorTokens, spaces } from '../util/constants'
import styled from 'styled-components'

type CardWithSeparatorProps = {
  contents: ReactElement[]
  paddingTop?: keyof typeof spaces
  paddingBottom?: keyof typeof spaces
}

export const CardWithSeparator = ({
  contents,
  paddingTop,
  paddingBottom,
  ...props
}: CardWithSeparatorProps) => {
  return (
    <StyledWrapper
      $paddingTop={paddingTop}
      $paddingBottom={paddingBottom}
      {...props}
    >
      {Children.map(contents, (child, idx) => (
        <StyledContent $enableSeparator={idx !== contents.length - 1}>
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
  // padding: 12px 0 18px;
  padding: ${(p) =>
    `${spaces[p.$paddingTop] ?? '12px'} 0 ${
      spaces[p.$paddingBottom] ?? '18px'
    }`};
`

const StyledContent = styled.div`
  width: 100%;
  padding: 0 18px;
  border-bottom: ${(p) => (p.$enableSeparator ? '1px solid #E6E6E6' : 'none')};
`
