import { Text } from '../Text'
import styled from 'styled-components'

export const SwapFormFrame = styled.div`
  width: 456px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.96);
  padding: 0 18px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.02);
  backdrop-filter: blur(4px);
  margin: 0 auto;
`

export const SwapFormHeading = styled(Text).attrs(() => ({
  type: 'heading',
  variant: 'normal',
}))`
  padding: 44px 0 32px;
`
