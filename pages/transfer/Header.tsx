import { Text } from '../../components/Text'
import styled from 'styled-components'

export const Header = ({ title, children }) => {
  return (
    <>
      <StyledTitle type="title" variant="bold">
        {title}
      </StyledTitle>
      <StyledSubtitle type="body" variant="light">
        {children}
      </StyledSubtitle>
    </>
  )
}

const StyledTitle = styled(Text)`
  padding: 36px 0 12px;
`

const StyledSubtitle = styled(Text)`
  padding-bottom: 48px;
`
