import React, { ForwardedRef, forwardRef } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { Text } from '../Text'
import { useConnectWallet } from '../../hooks/useConnectWallet'
import { useRecoilState } from 'recoil'
import { walletState, WalletStatusType } from '../../state/atoms/walletAtoms'
import { useRouter } from 'next/router'
import { Address, Arrow, Open } from '../../icons'
import { IconWrapper } from '../IconWrapper'
import { ConnectedWalletButton } from '../ConnectedWalletButton'
import { Logo } from '../../icons/Logo'
import { LogoText } from '../../icons/LogoText'

export function NavigationSidebar() {
  const { mutate: connectWallet } = useConnectWallet()
  const [{ key }, setWalletState] = useRecoilState(walletState)

  function resetWalletConnection() {
    setWalletState({
      status: WalletStatusType.idle,
      address: '',
      key: null,
      client: null,
    })
  }

  const hasWalletName = Boolean(key?.name)

  const { pathname } = useRouter()
  const getIsActive = (path) => pathname === path

  return (
    <StyledWrapper>
      <StyledMenuContainer>
        <Link href="/" passHref>
          <StyledDivForLogo as="a">
            <Logo data-logo="" width="37px" height="47px" />
            <LogoText />
          </StyledDivForLogo>
        </Link>

        <StyledConnectedWalletButton
          onClick={
            hasWalletName ? resetWalletConnection : () => connectWallet(null)
          }
          walletName={key?.name}
        />

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
    </StyledWrapper>
  )
}

const TextAsLink = forwardRef(function TextAsLinkComponent(
  props,
  ref: ForwardedRef<any>
) {
  return <Text as="a" {...props} ref={ref} />
})

const StyledWrapper = styled.div`
  position: sticky;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 32px;
  background-color: #ffffff;
  overflow: hidden;
  border-right: 1px solid #eaeaea;
`

const StyledMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  padding: 21px 0;
`

const StyledLink = styled(TextAsLink)`
  padding: 10px 10px;
  border-radius: 6px;
  background-color: ${(p) =>
    p.$active ? 'rgba(25, 29, 32, 0.05)' : 'rgba(25, 29, 32, 0)'};
  backdrop-filter: ${(p) => (p.$active ? 'blur(4px)' : 'unset')};
  transition: background-color 0.15s ease-out;
  display: flex;
  align-items: center;
  &:not(&:last-child) {
    margin-bottom: 2px;
  }
  &:hover {
    background-color: rgba(25, 29, 32, 0.1);
  }
  &:active {
    background-color: rgba(25, 29, 32, 0.05);
  }
  & span {
    margin-left: 10px;
  }
`

const StyledFooterText = styled(Text)`
  padding-bottom: 29px;
  position: relative;
  z-index: 1;
`

const StyledConnectedWalletButton = styled(ConnectedWalletButton)`
  margin-bottom: 8px;
`

const StyledDivForLogo = styled.div`
  display: grid;
  grid-template-columns: 37px 1fr;
  column-gap: 9px;
  align-items: center;
  padding-bottom: 16px;
  & [data-logo] {
    margin-bottom: 4px;
  }
`
