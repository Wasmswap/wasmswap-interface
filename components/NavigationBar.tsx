import { Container } from './Container'
import styled from 'styled-components'
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
          Wasmswap
        </Text>
        <Button size="medium" onClick={address ? undefined : connectWallet}>
          {address || 'Connect Wallet'}
        </Button>
      </StyledWrapper>
    </Container>
  )
}

const StyledWrapper = styled.div`
  padding: 18px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
