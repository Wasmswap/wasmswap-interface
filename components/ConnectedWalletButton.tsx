import { media, styled } from 'components/theme'
import { Wallet } from '../icons/Wallet'
import { Text } from './Text'
import { IconWrapper } from './IconWrapper'
import { Button } from './Button'
import { CopyTextTooltip, Tooltip } from './Tooltip'
import { useBaseTokenInfo } from '../hooks/useTokenInfo'
import { useTokenBalance } from '../hooks/useTokenBalance'
import { formatTokenBalance } from '../util/conversion'
import { Logout } from '../icons/Logout'
import { Copy } from '../icons/Copy'
import { CSS } from '@stitches/react'
import { useRecoilValue } from 'recoil'
import { walletState } from '../state/atoms/walletAtoms'
import { Valid } from '../icons/Valid'
import React from 'react'

type ConnectedWalletButtonProps = { css?: CSS } & {
  walletName?: string
  onConnect: () => void
  onDisconnect: () => void
  connected: boolean
}

export const ConnectedWalletButton = ({
  onConnect,
  connected,
  onDisconnect,
  walletName,
  ...props
}: ConnectedWalletButtonProps) => {
  const baseToken = useBaseTokenInfo()
  const { balance } = useTokenBalance(baseToken?.symbol)
  const { address } = useRecoilValue(walletState)

  if (!connected) {
    return (
      <Button onClick={onConnect} variant="primary" {...props}>
        Connect Keplr
      </Button>
    )
  }

  return (
    <StyledWalletButton {...props} role="button">
      <IconWrapper size="16px" color="#FE8D9E" icon={<Wallet />} />
      <div data-content="">
        <Text variant="link" color="body">
          {walletName}
        </Text>
        <Text
          variant="legend"
          css={{
            '-webkit-background-clip': 'text',
            '-webkit-text-fill-color': 'transparent',
            backgroundImage:
              'linear-gradient(90.55deg, #FE9C9E 1.35%, #FA2995 19.1%, #EA1EE9 37.37%, #287CF4 58.83%, #4CA7F2 75.84%, #31DAE2 99.52%)',
          }}
        >
          {formatTokenBalance(balance, { includeCommaSeparation: true })}{' '}
          {baseToken?.symbol}
        </Text>
      </div>
      <StyledDivForActions>
        <StyledDivForInlineActions>
          <CopyTextTooltip
            label="Copy wallet address"
            successLabel="Wallet address copied!"
            ariaLabel="Copy wallet address"
            value={address}
          >
            {({ copied, ...bind }) => (
              <Button
                variant="ghost"
                size="small"
                icon={<IconWrapper icon={copied ? <Valid /> : <Copy />} />}
                {...bind}
              />
            )}
          </CopyTextTooltip>
          <Tooltip
            label="Disconnect your wallet"
            aria-label="Disconnect your wallet"
          >
            <Button
              variant="ghost"
              size="small"
              onClick={onDisconnect}
              icon={<IconWrapper icon={<Logout />} />}
            />
          </Tooltip>
        </StyledDivForInlineActions>
      </StyledDivForActions>
    </StyledWalletButton>
  )
}

const StyledDivForActions = styled('div', {
  position: 'absolute',
  right: 0,
  top: 0,
  padding: '0 $6 0 $8',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  background:
    'linear-gradient(to right, $colors$white0 0%, $colors$white95 5%, $colors$white)',
  borderRadius: '$2',
  opacity: 0,
  transition: 'opacity .1s ease-out',
})

const StyledDivForInlineActions = styled('div', {
  display: 'flex',
  columnGap: '$space$2',
})

const StyledWalletButton = styled('div', {
  position: 'relative',
  transition: 'background-color .1s ease-out, border .1s ease-out',
  display: 'flex',
  alignItems: 'center',
  columnGap: '$space$6',
  padding: '$4 $6 $5',
  borderRadius: '$2',
  textAlign: 'left',
  border: '1px solid $borderColors$default',
  '&:hover': {
    border: '1px solid $borderColors$focus',
    [`${StyledDivForActions}`]: {
      opacity: 1,
    },
  },
  [media.sm]: {
    border: '1px solid $borderColors$focus',
    [`${StyledDivForActions}`]: {
      opacity: 1,
    },
  },
})
