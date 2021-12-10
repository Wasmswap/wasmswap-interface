import { styled } from '@stitches/react'
import { Wallet } from '../icons/Wallet'
import { Union } from '../icons/Union'
import { Text } from './Text'
import { colorTokens } from '../util/constants'
import { HTMLProps } from 'react'

type ConnectedWalletButtonProps = Omit<
  HTMLProps<HTMLButtonElement>,
  'children' | 'type' | 'ref'
> & {
  walletName?: string
  onClick: () => void
}

export const ConnectedWalletButton = ({
  onClick,
  walletName,
  ...props
}: ConnectedWalletButtonProps) => {
  return (
    <StyledElementForButton
      {...props}
      onClick={onClick}
      connected={Boolean(walletName)}
    >
      {walletName ? (
        <>
          <Wallet />
          <Text type="subtitle" variant="light" color="inherit">
            {walletName}
          </Text>
          <Union />
        </>
      ) : (
        <Text type="subtitle" variant="light" color="inherit">
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
        '&:hover': {
          backgroundColor: colorTokens.black,
          color: colorTokens.white,
        },
      },
      false: {
        color: colorTokens.white,
        backgroundColor: colorTokens.black,
        '&:hover': {
          backgroundColor: colorTokens.gray,
          color: colorTokens.black,
        },
      },
    },
  },
})
