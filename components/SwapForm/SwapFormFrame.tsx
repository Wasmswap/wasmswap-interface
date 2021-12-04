import styled, { css } from 'styled-components'
import { colorTokens } from '../../util/constants'

export const swapFormSize = css`
  width: 90%;
  max-width: 420px;
`

export const SwapFormFrame = styled.div<{ $expanded: boolean }>`
  ${swapFormSize};
  position: relative;
  border-radius: 6px;
  background-color: ${(p) =>
    p.$expanded ? colorTokens.lightGray : colorTokens.white};
  padding: ${(p) => (p.$expanded ? '0 32px' : '0 18px')};
  box-shadow: ${(p) =>
    p.$expanded
      ? '0px 0px 80px 4px rgba(158, 116, 195, 0.18)'
      : '2px 2px 10px rgba(0, 0, 0, 0.02)'};
  backdrop-filter: blur(4px);
`
