import styled, { css } from 'styled-components'

const FORM_WIDTH = {
  default: 456,
  expanded: 628,
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
  background-color: rgba(255, 255, 255, 0.96);
  padding: 0 18px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.02);
  backdrop-filter: blur(4px);
  margin: 12px auto 0;
`
