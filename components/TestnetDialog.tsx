import { Dialog, StyledCloseIcon } from './Dialog'
import { Text } from './Text'
import { useState } from 'react'
import { styled } from 'components/theme'
import { Button } from './Button'

export const TestnetDialog = () => {
  const [isShowing, setShowing] = useState(true)

  const requestClose = () => setShowing(false)

  return (
    <Dialog isShowing={isShowing} onRequestClose={requestClose} kind="blank">
      <Container>
        <StyledDivForHeader>
          <Text type="heading" variant="bold">
            Testnet Warning
          </Text>
          <StyledCloseIcon onClick={requestClose} />
        </StyledDivForHeader>
        <Text paddingBottom="23px" type="caption" variant="light">
          This app is currently in beta and operating on the Uni testnet. You
          will not be able to trade real assets.
        </Text>
        <StyledButton onClick={requestClose}>Enter the App</StyledButton>
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
