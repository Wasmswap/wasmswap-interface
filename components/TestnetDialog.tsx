import { Dialog, StyledCloseIcon } from './Dialog'
import { Text } from './Text'
import { useState } from 'react'
import { styled } from '@stitches/react'
import { Button } from './Button'

export const TestnetDialog = () => {
  const [isShowing, setShowing] = useState(true)

  const requestClose = () => setShowing(false)

  return (
    <Dialog isShowing={isShowing} onRequestClose={requestClose} kind="blank">
      <Container>
        <StyledDivForHeader>
          <Text type="heading" variant="bold">
            Testnet Alert
          </Text>
          <StyledCloseIcon onClick={requestClose} />
        </StyledDivForHeader>
        <Text paddingBottom="23px" type="caption" variant="light">
          The app is in beta and operates on the uni testnet. You will
          not be able to trade real assets. Let us know if you encounter any
          issues.
        </Text>
        <StyledButton onClick={requestClose}>Enter the app</StyledButton>
      </Container>
    </Dialog>
  )
}

const StyledDivForHeader = styled('div', {
  display: 'grid',
  textAlign: 'center',
  alignItems: 'center',
  gridTemplateColumns: '1fr 18px',
  padding: '20px 0 14px',
})

const Container = styled('div', {
  padding: '0 32px 24px',
})

const StyledButton = styled(Button, {
  width: '100% !important',
})
