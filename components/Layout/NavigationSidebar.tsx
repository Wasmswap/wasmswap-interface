import React from 'react'
import Link from 'next/link'
import { Button } from '../Button'
import { Text } from '../Text'
import { useConnectWallet } from '../../hooks/useConnectWallet'
import { useRecoilState } from 'recoil'
import { walletState, WalletStatusType } from '../../state/atoms/walletAtoms'
import { useRouter } from 'next/router'
import { Address, ArrowUp, Open } from '../../icons'
import { IconWrapper } from '../IconWrapper'
import { ConnectedWalletButton } from '../ConnectedWalletButton'
import { Logo } from '../../icons/Logo'
import { LogoText } from '../../icons/LogoText'
import { Github } from '../../icons/Github'
import { Discord } from '../../icons/Discord'
import { Telegram } from '../../icons/Telegram'
import { Twitter } from '../../icons/Twitter'
import { styled } from '../theme'
import { __TEST_MODE__ } from '../../util/constants'

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
  const getIsLinkActive = (path) => pathname === path

  const buttonIconCss = {
    '& svg': {
      color: '$iconColors$tertiary',
    },
  }

  return (
    <StyledWrapper>
      <StyledMenuContainer>
        <Link href="/" passHref>
          <StyledDivForLogo as="a">
            <Logo data-logo="" width="37px" height="47px" />
            <div data-logo-label="">
              <Text
                variant="caption"
                color="error"
                css={{ padding: '0 0 $1 0' }}
              >
                {__TEST_MODE__ ? 'Testnet' : 'Beta'}
              </Text>
              <LogoText />
            </div>
          </StyledDivForLogo>
        </Link>

        <ConnectedWalletButton
          connected={Boolean(key?.name)}
          walletName={key?.name}
          onConnect={() => connectWallet(null)}
          onDisconnect={resetWalletConnection}
          css={{ marginBottom: '$6' }}
        />

        <StyledListForLinks>
          <Link href="/" passHref>
            <Button
              as="a"
              variant="menu"
              size="large"
              iconLeft={<IconWrapper icon={<Address />} />}
              selected={getIsLinkActive('/')}
            >
              Swap
            </Button>
          </Link>
          <Link href="/transfer" passHref>
            <Button
              as="a"
              variant="menu"
              size="large"
              iconLeft={<IconWrapper icon={<ArrowUp />} />}
              selected={getIsLinkActive('/transfer')}
            >
              Transfer
            </Button>
          </Link>
          <Link href="/pools" passHref>
            <Button
              as="a"
              variant="menu"
              size="large"
              iconLeft={<IconWrapper icon={<Open />} />}
              selected={getIsLinkActive('/pools')}
            >
              Liquidity
            </Button>
          </Link>
        </StyledListForLinks>
      </StyledMenuContainer>
      <StyledDivForFooter data-footer="">
        <Button
          as="a"
          href={process.env.NEXT_PUBLIC_DISCORD_LINK}
          target="__blank"
          icon={<IconWrapper icon={<Discord />} />}
          variant="ghost"
          size="medium"
          css={buttonIconCss}
        />
        <Button
          as="a"
          href={process.env.NEXT_PUBLIC_TELEGRAM_LINK}
          target="__blank"
          icon={<IconWrapper icon={<Telegram />} />}
          variant="ghost"
          size="medium"
          css={buttonIconCss}
        />
        <Button
          as="a"
          href={process.env.NEXT_PUBLIC_TWITTER_LINK}
          target="__blank"
          icon={<IconWrapper icon={<Twitter />} />}
          variant="ghost"
          size="medium"
          css={buttonIconCss}
        />
        <Button
          as="a"
          href={process.env.NEXT_PUBLIC_INTERFACE_GITHUB_LINK}
          target="__blank"
          icon={<IconWrapper icon={<Github />} />}
          variant="ghost"
          size="medium"
          css={buttonIconCss}
        />
      </StyledDivForFooter>
    </StyledWrapper>
  )
}

const StyledWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '0 $8',
  backgroundColor: '$backgroundColors$base',
  overflow: 'auto',
  borderRight: '1px solid $borderColors$inactive',
  position: 'sticky',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  maxHeight: '100vh',
  zIndex: '$1',
})

const StyledMenuContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  zIndex: '$2',
  padding: '$10 0',
})

const StyledListForLinks = styled('div', {
  display: 'flex',
  rowGap: '$space$2',
  flexDirection: 'column',
})

const StyledDivForFooter = styled('div', {
  display: 'flex',
  columnGap: '$space$2',
  padding: '$13 0',
})

const StyledDivForLogo = styled('div', {
  display: 'grid',
  gridTemplateColumns: '37px 1fr',
  columnGap: '$space$4',
  alignItems: 'center',
  paddingBottom: '$8',
  '& [data-logo]': {
    marginBottom: '$2',
  },
  '& svg': {
    color: '$colors$black',
  },
})
