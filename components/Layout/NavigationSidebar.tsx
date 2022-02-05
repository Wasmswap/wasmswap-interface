import React, { ReactNode, useState } from 'react'
import Link from 'next/link'
import { Button } from '../Button'
import { Text } from '../Text'
import { useConnectWallet } from 'hooks/useConnectWallet'
import { useRecoilState } from 'recoil'
import { walletState, WalletStatusType } from 'state/atoms/walletAtoms'
import { useRouter } from 'next/router'
import { Address, ArrowUp, Open } from 'icons'
import { IconWrapper } from '../IconWrapper'
import { Inline } from 'components/Inline'
import { Column } from 'components/Column'
import { ConnectedWalletButton } from '../ConnectedWalletButton'
import { Logo } from 'icons/Logo'
import { LogoText } from 'icons/LogoText'
import { Github } from 'icons/Github'
import { Discord } from 'icons/Discord'
import { Telegram } from 'icons/Telegram'
import { Twitter } from 'icons/Twitter'
import { UnionIcon } from 'icons/Union'
import { ChevronIcon } from 'icons/Chevron'
import { MoonIcon } from 'icons/Moon'
import { media, styled } from '../theme'
import { __TEST_MODE__, APP_NAME } from 'util/constants'
import { useMedia } from 'hooks/useMedia'
import { Divider } from '../Divider'
import { ToggleSwitch } from '../ToggleSwitch'
import { FeedbackIcon } from '../../icons/Feedback'
import { AppTheme } from '../theme/themeAtom'
import { useControlTheme } from '../theme/hooks/useTheme'
import { UpRightArrow } from '../../icons/UpRightArrow'

type NavigationSidebarProps = {
  shouldRenderBackButton?: boolean
  backButton?: ReactNode
}

export function NavigationSidebar({
  shouldRenderBackButton,
  backButton,
}: NavigationSidebarProps) {
  const { mutate: connectWallet } = useConnectWallet()
  const [{ key }, setWalletState] = useRecoilState(walletState)

  const themeController = useControlTheme()

  const isMobile = useMedia('sm')
  const [isOpen, setOpen] = useState(false)

  function resetWalletConnection() {
    setWalletState({
      status: WalletStatusType.idle,
      address: '',
      key: null,
      client: null,
    })
  }

  const walletButton = (
    <ConnectedWalletButton
      connected={Boolean(key?.name)}
      walletName={key?.name}
      onConnect={() => connectWallet(null)}
      onDisconnect={resetWalletConnection}
      css={{ marginBottom: '$6' }}
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
                checked={themeController.theme === AppTheme.dark}
                optionLabels={['Dark theme', 'Light theme']}
              />
            }
          >
            Dark mode
          </Button>
        </Inline>
        <Divider offsetY="$6" />
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
