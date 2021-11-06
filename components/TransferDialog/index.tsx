import { Dialog } from '../Dialog'
import { Text } from '../Text'
import styled from 'styled-components'
import { WalletCardWithInput } from './WalletCardWithInput'

export const TransferDialog = ({ isShowing, onRequestClose }) => {
  return (
    <Dialog isShowing={isShowing} onRequestClose={onRequestClose}>
      <StyledContent>
        <Text type="title">Deposit</Text>
        <Text paddingTop="24" paddingBottom="18" variant="light">
          How many Juno would you like to transfer?
        </Text>
        <WalletCardWithInput />
      </StyledContent>
    </Dialog>
  )
}

const StyledContent = styled.div`
  padding: 0 24px 24px;
`
