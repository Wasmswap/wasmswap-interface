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

  const { pathname } = useRouter()
  const getIsActive = (path) => pathname === path

  return (
    <StyledWrapper>
      <StyledMenuContainer>
        <Link href="/" passHref>
          <StyledDivForLogo as="a">
            <Logo data-logo="" width="37px" height="47px" />
            <div data-logo-label="">
              <StyledTextForLogoAnnotation
                color="error"
                css={{ padding: '0 0 $1 $3' }}
              >
                Testnet
              </StyledTextForLogoAnnotation>
              <LogoText />
            </div>
          </StyledDivForLogo>
        </Link>

        <StyledConnectedWalletButton
          connected={Boolean(key?.name)}
          walletName={key?.name}
          onConnect={() => connectWallet(null)}
          onDisconnect={resetWalletConnection}
        />

        <Link href="/" passHref>
          <StyledLink variant="primary" $active={getIsActive('/')}>
            <IconWrapper size="16px" icon={<Address />} />
            <span>Swap</span>
          </StyledLink>
        </Link>
        <Link href="/transfer" passHref>
          <StyledLink variant="primary" $active={getIsActive('/transfer')}>
            <IconWrapper size="16px" icon={<Arrow />} />
            <span>Transfer</span>
          </StyledLink>
        </Link>
        <Link href="/pools" passHref>
          <StyledLink variant="primary" $active={getIsActive('/pools')}>
            <IconWrapper size="16px" icon={<Open />} />
            <span>Liquidity</span>
          </StyledLink>
        </Link>
      </StyledMenuContainer>

      <StyledDivForFooter data-footer="">
        <Text variant="body" color="tertiary" css={{ padding: '$6 0' }}>
          Testnet
        </Text>
        <Text variant="body" color="tertiary">
          This website is currently in beta. Please{' '}
          <a
            href={process.env.NEXT_PUBLIC_FEEDBACK_LINK}
            target="blank"
            style={{ textDecoration: 'underline' }}
          >
            provide feedback
          </a>
          .
        </Text>
      </StyledDivForFooter>
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 32px;
  background-color: #ffffff;
  overflow: auto;
  border-right: 1px solid #eaeaea;

  position: sticky;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  max-height: 100vh;
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
  transition: background-color 0.1s ease-out;
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

const StyledTextForLogoAnnotation = styled(Text)`
  font-size: 11px;
  line-height: 13px;
`

const StyledDivForFooter = styled.div`
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
