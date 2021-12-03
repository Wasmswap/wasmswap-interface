import React from 'react'
import styled from 'styled-components'
import { Container } from './Container'
import { Text } from './Text'
import { Button } from './Button'
import { useConnectWallet } from '../hooks/useConnectWallet'
import { useRecoilValue } from 'recoil'
import { walletState } from '../state/atoms/walletAtoms'

export function NavigationBar() {
  const connectWallet = useConnectWallet()
  const { address } = useRecoilValue(walletState)

  return (
    <Container>
      <StyledWrapper>
        <Text type="heading" variant="bold">
          Arcswap
        </Text>

        <StyledButton
          size="medium"
          onClick={address ? undefined : connectWallet}
        >
          <StyledText color="white" variant="light">
            {address || 'Connect Wallet'}
          </StyledText>
        </StyledButton>
      </StyledWrapper>
    </Container>
  )
}

const StyledWrapper = styled.div`
  padding: 18px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`

const StyledButton = styled(Button)`
  background: #161616;
`

const StyledText = styled(Text)`
  @media only screen and (max-width: 768px) {
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media only screen and (max-width: 400px) {
    max-width: 90px;
  }
  @media only screen and (max-width: 350px) {
    max-width: 70px;
  }
`
