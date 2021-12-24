import { styled } from '@stitches/react'

export const Divider = () => <StyledHR />

const StyledHR = styled('div', {
  backgroundColor: 'rgba(25, 29, 32, 0.1)',
  width: '100%',
  height: '1px',
  margin: 0,
  padding: 0,
  display: 'block',
})
