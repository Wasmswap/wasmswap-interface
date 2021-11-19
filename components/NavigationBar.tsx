import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { Container } from './Container'
import { Text } from './Text'
import { Button } from './Button'
import { useConnectWallet } from '../hooks/useConnectWallet'
import { useRecoilValue } from 'recoil'
import { walletState } from '../state/atoms/walletAtoms'
import { useRouter } from 'next/router'

export function NavigationBar() {
  const connectWallet = useConnectWallet()
  const { address } = useRecoilValue(walletState)

  return (
    <Container>
      <StyledWrapper>
        <StyledContainer>
          <Link href="/" passHref>
            <Text
              as="a"
              style={{ marginRight: 40 }}
              type="heading"
              variant="bold"
            >
              Junoswap
            </Text>
          </Link>

          <AppLinks />
        </StyledContainer>

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

function AppLinks() {
  const { pathname } = useRouter()
  const getIsActive = (path) => pathname === path

  return (
    <>
      <Link href="/" passHref>
        <StyledLink
          as="a"
          type="body"
          variant="light"
          $active={getIsActive('/')}
        >
          Swap
        </StyledLink>
      </Link>
      <Link href="/transfer" passHref>
        <StyledLink
          as="a"
          type="body"
          variant="light"
          $active={getIsActive('/transfer')}
        >
          Transfer
        </StyledLink>
      </Link>
      <Link href="/pools" passHref>
        <StyledLink
          as="a"
          type="body"
          variant="light"
          $active={getIsActive('/pools')}
        >
          Pools
        </StyledLink>
      </Link>
    </>
  )
}

const StyledWrapper = styled.div`
  padding: 12px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`

const StyledLink = styled(Text)`
  padding: 0 12px;
  opacity: ${(p) => (p.$active ? 1 : 0.4)};
  transition: opacity 0.15s ease-out;
  &:hover {
    opacity: 1;
  }
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
