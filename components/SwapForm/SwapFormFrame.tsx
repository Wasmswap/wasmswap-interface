import styled, { css } from 'styled-components'
import { colorTokens } from '../../util/constants'

const FORM_WIDTH = {
  default: 456,
  expanded: 638,
}

export const swapFormSize = css`
  width: 90%;
  max-width: ${FORM_WIDTH.default}px;
`

export const SwapFormFrame = styled.div<{ $expanded: boolean }>`
  ${swapFormSize};
  max-width: ${(p) =>
    p.$expanded ? FORM_WIDTH.expanded : FORM_WIDTH.default}px;
  position: relative;
  border-radius: 6px;
  background-color: ${(p) =>
    p.$expanded ? colorTokens.lightGray : colorTokens.white};
  padding: 0 18px;
  box-shadow: ${(p) =>
    p.$expanded
      ? '2px 2px 10px rgba(0, 0, 0, 0.02)'
      : '0px 0px 80px 4px rgba(158, 116, 195, 0.18)'};
  backdrop-filter: blur(4px);
  margin: 12px auto 0;
`
