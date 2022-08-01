import { useWallet, useWalletManager } from '@noahsaso/cosmodal'
import { Logo, LogoText } from 'icons'
import {
  AddressIcon,
  ArrowUpIcon,
  Button,
  ChevronIcon,
  Column,
  Discord,
  Divider,
  FeedbackIcon,
  Github,
  IconWrapper,
  Inline,
  media,
  MoonIcon,
  Open,
  SharesIcon,
  styled,
  Telegram,
  Text,
  ToggleSwitch,
  TreasuryIcon,
  Twitter,
  UnionIcon,
  UpRightArrow,
  useControlTheme,
  useMedia,
} from 'junoblocks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode, useState } from 'react'
import { __TEST_MODE__, APP_NAME } from 'util/constants'

import { ConnectedWalletButton } from '../ConnectedWalletButton'

type NavigationSidebarProps = {
  shouldRenderBackButton?: boolean
  backButton?: ReactNode
}

export function NavigationSidebar({
  shouldRenderBackButton,
  backButton,
}: NavigationSidebarProps) {
  const { connect, disconnect } = useWalletManager()
  const { address, name } = useWallet()

  const themeController = useControlTheme()

  const isMobile = useMedia('sm')
  const [isOpen, setOpen] = useState(false)

  function resetWalletConnection() {
    disconnect()
  }

  const walletButton = (
    <ConnectedWalletButton
      connected={Boolean(name)}
      walletName={name}
      walletAddress={address}
      onConnect={() => connect()}
      onDisconnect={resetWalletConnection}
      css={{ marginBottom: '$8' }}
    />
  )

  const { pathname } = useRouter()
  const getIsLinkActive = (path) => pathname === path

  const menuLinks = (
    <StyledListForLinks>
      <Link href="/" passHref>
        <Button
          as="a"
          variant="menu"
          size="large"
          iconLeft={<AddressIcon />}
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
          iconLeft={<ArrowUpIcon />}
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
      <Divider offsetY="$8" />
      <Link href={process.env.NEXT_PUBLIC_GOVERNANCE_LINK_URL} passHref>
        <Button
          as="a"
          target="__blank"
          variant="ghost"
          size="large"
          iconLeft={<TreasuryIcon />}
          iconRight={<IconWrapper icon={<UpRightArrow />} />}
        >
          {process.env.NEXT_PUBLIC_GOVERNANCE_LINK_LABEL}
        </Button>
      </Link>
      <Link href={process.env.NEXT_PUBLIC_PRICE_LINK_URL} passHref>
        <Button
          as="a"
          target="__blank"
          variant="ghost"
          size="large"
          iconLeft={<SharesIcon />}
          iconRight={<IconWrapper icon={<UpRightArrow />} />}
        >
          {process.env.NEXT_PUBLIC_PRICE_LINK_LABEL}
        </Button>
      </Link>
    </StyledListForLinks>
  )

  if (isMobile) {
    const triggerMenuButton = isOpen ? (
      <Button
        onClick={() => setOpen(false)}
        icon={<UnionIcon />}
        variant="ghost"
      />
    ) : (
      <Button
        onClick={() => setOpen(true)}
        iconRight={<ChevronIcon rotation="-90deg" />}
      >
        Menu
      </Button>
    )

    if (shouldRenderBackButton) {
      return (
        <>
          <StyledWrapperForMobile>
            <Inline align="center" justifyContent="space-between">
              <Column align="flex-start" css={{ flex: 0.3 }}>
                {backButton}
              </Column>

              <Link href="/" passHref>
                <Column
                  css={{ flex: 0.4, color: '$colors$black' }}
                  align="center"
                  as="a"
                >
                  <Logo data-logo="" width="37px" height="47px" />
                </Column>
              </Link>
              <Column align="flex-end" css={{ flex: 0.3 }}>
                {triggerMenuButton}
              </Column>
            </Inline>
            {isOpen && (
              <Column css={{ paddingTop: '$12' }}>
                {walletButton}
                {menuLinks}
              </Column>
            )}
          </StyledWrapperForMobile>
          <Divider />
        </>
      )
    }

    return (
      <StyledWrapperForMobile>
        <Inline align="center" justifyContent="space-between">
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
          {triggerMenuButton}
        </Inline>
        {isOpen && (
          <Column css={{ paddingTop: '$12' }}>
            {walletButton}
            {menuLinks}
          </Column>
        )}
      </StyledWrapperForMobile>
    )
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

        {walletButton}
        {menuLinks}
      </StyledMenuContainer>
      <div>
        <Text variant="legend" css={{ padding: '$4 $3' }}>
          {APP_NAME} v{process.env.NEXT_PUBLIC_APP_VERSION}
        </Text>
        <Inline css={{ display: 'grid' }}>
          <Button
            iconLeft={<MoonIcon />}
            variant="ghost"
            size="large"
            onClick={(e) => {
              if (e.target !== document.querySelector('#theme-toggle')) {
                themeController.toggle()
              }
            }}
            iconRight={
              <ToggleSwitch
                id="theme-toggle"
                name="dark-theme"
                onChange={themeController.setDarkTheme}
                checked={themeController.theme.name === 'dark'}
                optionLabels={['Dark theme', 'Light theme']}
              />
            }
          >
            Dark mode
          </Button>
        </Inline>
        <Divider offsetY="$6" />
        <Column gap={4}>
          <Button
            as="a"
            href={process.env.NEXT_PUBLIC_FEEDBACK_LINK}
            target="__blank"
            variant="ghost"
            size="large"
            iconLeft={<FeedbackIcon />}
            iconRight={<IconWrapper icon={<UpRightArrow />} />}
          >
            Provide feedback
          </Button>
        </Column>
        <Inline gap={2} css={{ padding: '$20 0 $13' }}>
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
        </Inline>
      </div>
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

const StyledWrapperForMobile = styled('div', {
  display: 'block',
  position: 'sticky',
  left: 0,
  top: 0,
  padding: '$10 $12',
  backgroundColor: '$backgroundColors$base',
  zIndex: '$3',
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

  [media.sm]: {
    paddingBottom: 0,
  },

  variants: {
    size: {
      small: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& [data-logo]': {
          marginBottom: 0,
        },
      },
    },
  },
})

const buttonIconCss = {
  '& svg': {
    color: '$iconColors$tertiary',
  },
}
