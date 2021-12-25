import { styled } from '@stitches/react'

export const Divider = ({ offsetY = 0 }) => (
  <StyledHR style={offsetY ? { margin: `${offsetY}px 0` } : undefined} />
)

const StyledHR = styled('div', {
  backgroundColor: 'rgba(25, 29, 32, 0.1)',
  width: '100%',
  height: '1px',
  margin: 0,
  padding: 0,
  display: 'block',
})
