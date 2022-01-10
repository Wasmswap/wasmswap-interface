import { styled } from 'components/theme'
import { Wallet } from '../icons/Wallet'
import { Union } from '../icons/Union'
import { Text } from './Text'
import { colorTokens } from '../util/constants'
import { HTMLProps } from 'react'
import { IconWrapper } from './IconWrapper'

type ConnectedWalletButtonProps = Omit<
  HTMLProps<HTMLButtonElement>,
  'children' | 'type' | 'ref'
> & {
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
  return (
    <StyledElementForButton
      {...props}
      onClick={!connected ? onConnect : undefined}
      connected={Boolean(walletName)}
    >
      {connected ? (
        <>
          <Wallet />
          <div>
            <Text variant="caption" color="secondary">
              Demo account
            </Text>
            <Text variant="primary" color="inherit">
              {walletName}
            </Text>
          </div>
          <IconWrapper icon={<Union />} onClick={onDisconnect} type="button" />
        </>
      ) : (
        <Text variant="title" color="inherit">
          Connect Keplr
        </Text>
      )}
    </StyledElementForButton>
  )
}

const StyledElementForButton = styled('button', {
  display: 'grid',
  alignItems: 'center',
  columnGap: '12px',
  padding: '10px 16px 10px 10px',
  borderRadius: 8,
  border: `1px solid ${colorTokens.black}`,
  transition: 'background-color .15s ease-out, color .15s ease-out',
  variants: {
    connected: {
      true: {
        textAlign: 'left',
        gridTemplateColumns: '16px 1fr 9px',
        color: colorTokens.black,
      },
      false: {
        color: colorTokens.white,
        backgroundColor: colorTokens.black,
        '&:hover': {
          backgroundColor: colorTokens.gray,
          borderColor: colorTokens.gray,
          color: colorTokens.white,
        },
      },
    },
  },
})
