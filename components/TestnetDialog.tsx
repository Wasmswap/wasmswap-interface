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
          <Text variant="header">Demo mode warning</Text>
          <StyledCloseIcon onClick={requestClose} />
        </StyledDivForHeader>
        <Text css={{ paddingBottom: '$12' }} variant="body">
          This app is currently in beta and operating in demo mode. The app
          serves only the presentation and testing purposes. You will not be
          able to trade real assets.
        </Text>
        <Button css={{ width: '100%' }} size="large" onClick={requestClose}>
          Enter the App
        </Button>
      </Container>
    </Dialog>
  )
}

const StyledDivForHeader = styled('div', {
  display: 'grid',
  textAlign: 'center',
  alignItems: 'center',
  gridTemplateColumns: '1fr $space$9',
  padding: '$10 0 $7',
})

const Container = styled('div', {
  padding: '0 $16 $12',
})
