import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { Text } from '../Text'
import { Button } from '../Button'
import { useConnectWallet } from '../../hooks/useConnectWallet'
import { useRecoilValue } from 'recoil'
import { walletState } from '../../state/atoms/walletAtoms'
import { useRouter } from 'next/router'
import { Address, Open, Arrow } from '../../icons'
import { IconWrapper } from '../IconWrapper'

export function NavigationSidebar() {
  const { mutate: connectWallet } = useConnectWallet()
  const { address } = useRecoilValue(walletState)

  const { pathname } = useRouter()
  const getIsActive = (path) => pathname === path

  return (
    <StyledWrapper>
      <StyledMenuContainer>
        <Link href="/" passHref>
          <StyledLogoText type="heading" variant="bold">
            Junoswap
          </StyledLogoText>
        </Link>

        <StyledButton
          size="medium"
          onClick={address ? undefined : connectWallet}
        >
          <StyledText color="white" variant="light">
            {address || 'Connect Wallet'}
          </StyledText>
        </StyledButton>

        <Link href="/" passHref>
          <StyledLink
            as="a"
            type="body"
            variant="light"
            $active={getIsActive('/')}
          >
            <IconWrapper size="16px" icon={<Address />} />
            <span>Swap</span>
          </StyledLink>
        </Link>
        <Link href="/transfer" passHref>
          <StyledLink
            as="a"
            type="body"
            variant="light"
            $active={getIsActive('/transfer')}
          >
            <IconWrapper size="16px" icon={<Arrow />} />
            <span>Transfer</span>
          </StyledLink>
        </Link>
        <Link href="/pools" passHref>
          <StyledLink
            as="a"
            type="body"
            variant="light"
            $active={getIsActive('/pools')}
          >
            <IconWrapper size="16px" icon={<Open />} />
            <span>Pools</span>
          </StyledLink>
        </Link>
      </StyledMenuContainer>

      <StyledFooterText variant="light">Junoswap — 2021</StyledFooterText>

      <StyledSpringTop src="/spring-right.png" />
      <StyledSpringBottom src="/spring-left.png" />
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  position: sticky;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 32px;
  background-color: #f5f5f5;
  overflow: hidden;
`

const StyledMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  padding: 21px 0;
`

const TextAsLink = (props) => <Text as="a" {...props} />

const StyledLogoText = styled(TextAsLink)`
  height: 47px;
  padding-bottom: 16px;
`

const StyledLink = styled(TextAsLink)`
  padding: 10px 10px;
  border-radius: 6px;
  background-color: ${(p) =>
    p.$active ? 'rgba(25, 29, 32, 0.1)' : 'rgba(25, 29, 32, 0)'};
  backdrop-filter: ${(p) => (p.$active ? 'blur(4px)' : 'unset')};
  transition: background-color 0.15s ease-out;
  display: flex;
  align-items: center;
  &:hover {
    opacity: 1;
  }
  & span {
    margin-left: 10px;
  }
`

const StyledSpringBottom = styled.img`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 275%;
  z-index: 0;
  transform: translate(20%, 20%);
  user-select: none;
`

const StyledSpringTop = styled.img`
  position: absolute;
  right: 0;
  top: 0;
  width: 225%;
  z-index: 0;
  transform: translate(55%, -35%) rotate(-25deg);
  user-select: none;
`

const StyledButton = styled(Button)`
  background: #161616;
  margin-bottom: 8px;
`

const StyledFooterText = styled(Text)`
  padding-bottom: 29px;
  position: relative;
  z-index: 1;
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
