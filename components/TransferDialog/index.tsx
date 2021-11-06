import { Dialog } from '../Dialog'
import { Text } from '../Text'
import styled from 'styled-components'
import { WalletCardWithInput } from './WalletCardWithInput'
import { WalletCardWithBalance } from './WalletCardWithBalance'
import { Button } from '../Button'

export const TransferDialog = ({ isShowing, onRequestClose }) => {
  return (
    <Dialog isShowing={isShowing} onRequestClose={onRequestClose}>
      <StyledContent>
        <Text type="title">Deposit</Text>
        <Text paddingTop="24" paddingBottom="18" variant="light">
          How many Juno would you like to transfer?
        </Text>
        <StyledDivForCards>
          <WalletCardWithInput />
          <WalletCardWithBalance />
        </StyledDivForCards>
        <StyledDivForFee>
          <Text type="microscopic" variant="light">
            Transaction fees
          </Text>
          <Text type="microscopic" variant="bold" paddingLeft="10">
            $0,03
          </Text>
        </StyledDivForFee>
        <Button size="humongous">Deposit</Button>
      </StyledContent>
    </Dialog>
  )
}

const StyledContent = styled.div`
  padding: 0 24px 24px;
`

const StyledDivForCards = styled.div`
  display: grid;
  row-gap: 16px;
`

const StyledDivForFee = styled.div`
  display: flex;
  align-items: center;
  padding: 18px 0;
`
