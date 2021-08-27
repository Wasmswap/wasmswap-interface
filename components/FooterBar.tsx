import styled from 'styled-components'
import { Container } from './Container'
import { Text } from './Text'

export const FooterBar = () => {
  return (
    <Container as="footer">
      <StyledRow>
        <Text color="gray" variant="light">
          GitHub
        </Text>
        <Text color="gray" variant="light">
          Wasmswap @ 2021
        </Text>
      </StyledRow>
    </Container>
  )
}

const StyledRow = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: ${(p) => (p.$fullWidth ? '100%' : 'auto')};
  padding: 18px 0;
`
