import { CSS } from '@stitches/react'

import { styled } from '../theme'

type DividerProps = {
  offsetY?: string
  offsetTop?: string
  offsetBottom?: string
  css?: CSS
}

export const Divider = ({
  offsetY,
  offsetTop,
  offsetBottom,
  css: forwardedCSS,
}: DividerProps) => {
  const css: CSS = forwardedCSS ? { ...forwardedCSS } : {}

  if (offsetTop) css.marginTop = offsetTop
  if (offsetBottom) css.marginBottom = offsetBottom
  if (offsetY) css.margin = `${offsetY} 0`

  return <StyledHR css={css} />
}

const StyledHR = styled('div', {
  backgroundColor: '$colors$dark10',
  width: '100%',
  height: '1px',
  margin: 0,
  padding: 0,
  display: 'block',
})
