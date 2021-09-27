import { Text } from '../Text'
import styled from 'styled-components'
import { SegmentedController } from '../SegmentedController'

export const SwapFormHeading = styled(Text).attrs(() => ({
  type: 'heading',
  variant: 'normal',
}))`
  padding: 44px 0 32px;
  margin: 15px;
`

export const SwapFormSegmentedController = styled(SegmentedController)`
  width: 343px;
  margin: 0 auto;
`
