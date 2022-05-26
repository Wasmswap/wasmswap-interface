import { Button, Dialog, DialogContent, DialogHeader, Text } from 'junoblocks'

type DepositRedirectDialogProps = {
  isShowing: boolean
  onRequestClose: () => void
  tokenSymbol: string
  href: string
}

export const DepositRedirectDialog = ({
  isShowing,
  onRequestClose,
  tokenSymbol,
  href,
}: DepositRedirectDialogProps) => {
  return (
    <Dialog isShowing={isShowing} onRequestClose={onRequestClose}>
      <DialogHeader paddingBottom="$10">
        <Text variant="header">External asset deposit</Text>
      </DialogHeader>
      <DialogContent css={{ paddingBottom: '$12' }}>
        <Text css={{ paddingBottom: '$12' }} variant="body">
          You will be redirected to an external service to deposit your{' '}
          {tokenSymbol} on the chain.
        </Text>
        <Button
          as="a"
          href={href}
          target="__blank"
          css={{ width: '100%' }}
          size="large"
          onClick={onRequestClose}
        >
          Proceed
        </Button>
      </DialogContent>
    </Dialog>
  )
}
