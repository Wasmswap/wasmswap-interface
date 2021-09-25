import { Text } from '../Text'
import styled, { css } from 'styled-components'
import { SegmentedController } from '../SegmentedController'

export const swapFormSize = css`
  width: 90%;
  max-width: 456px;
`

export const SwapFormFrame = styled.div`
  ${swapFormSize};
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.96);
  padding: 0 18px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.02);
  backdrop-filter: blur(4px);
  margin: 12px auto 0;
`

export const SwapFormHeading = styled(Text).attrs(() => ({
  type: 'heading',
  variant: 'normal',
}))`
  padding: 44px 0 32px;
`

export const SwapFormSegmentedController = styled(SegmentedController)`
  width: 343px;
  margin: 0 auto;
`
