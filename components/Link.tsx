import { Text } from './Text'
import styled from 'styled-components'

const StyledLink = styled(Text)`
  cursor: pointer;
  user-select: none;
  transition: opacity 0.1s ease-out;
  &:hover {
    opacity: 0.75;
  }
`

export const Link = (props) => {
  return (
    <StyledLink
      variant="light"
      type="caption"
      color="lightBlue"
      role="button"
      {...props}
    />
  )
}
