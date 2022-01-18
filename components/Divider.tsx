import { styled } from './theme'
import { CSS } from '@stitches/react'

type DividerProps = {
  offsetY?: string
  offsetTop?: string
  offsetBottom?: string
}

export const Divider = ({ offsetY, offsetTop, offsetBottom }: DividerProps) => {
  const css: CSS = {}

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
