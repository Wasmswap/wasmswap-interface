import React, { ForwardedRef, forwardRef, useState } from 'react'
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
          <AppLogo />
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

      <StyledSpringBottom src="/spring-left.png" />
    </StyledWrapper>
  )
}

const AppLogo = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  return (
    <StyledImageForLogo
      onLoad={() => {
        setIsLoaded(true)
      }}
      src="/junoswap.png"
      title="Junoswap"
      alt="Junoswap"
      style={{ minHeight: isLoaded ? 'unset' : 42 }}
    />
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

const StyledFooterText = styled(Text)`
  padding-bottom: 29px;
  position: relative;
  z-index: 1;
`

const StyledConnectedWalletButton = styled(ConnectedWalletButton)`
  margin-bottom: 8px;
`

const StyledImageForLogo = styled.img`
  width: 80%;
  margin-bottom: 18px;
`
