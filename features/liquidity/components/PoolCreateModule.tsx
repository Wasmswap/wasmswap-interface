import { TokenSelector } from '../../swap/components/TokenSelector'
import { Row } from 'components'
import {
  Text,
  styled,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDivider,
  DialogButtons,
  Button,
  Spinner,
} from 'junoblocks'
import { useState } from 'react'

export const PoolCreateModule = () => {
  const [token1, setToken1] = useState({
    tokenSymbol: 'RAW',
    amount: 0,
  })
  const [token2, setToken2] = useState({
    tokenSymbol: '',
    amount: 0,
  })
  const onChangeToken1 = (event) => {
    setToken1(event)
  }
  const onChangeToken2 = (event) => {
    setToken2(event)
  }
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  return (
    <>
      <div>
        <Row style={{ gap: '2px' }}>
          <TokenPicker onClick={() => setIsDialogOpen(true)} />
          <TokenPicker onClick={() => setIsDialogOpen(true)} />
        </Row>
      </div>

      <AddLiquidityDialog
        token1={token1}
        token2={token2}
        onChangeToken1={onChangeToken1}
        onChangeToken2={onChangeToken2}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  )
}

const TokenPicker = ({ onClick }) => {
  return (
    <TokenPickerWrapper onClick={onClick}>
      <TokenPickerIconPlaceholder />
      <Text variant="hero">Token</Text>
      <Text style={{ marginTop: '60px' }}>Pick a token +</Text>
    </TokenPickerWrapper>
  )
}

const TokenPickerWrapper = styled('div', {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '60px 0',
  cursor: 'pointer',
  backgroundColor: '$backgroundColors$primary',
  borderRadius: '6px',
})

const TokenPickerIconPlaceholder = styled('div', {
  border: '1px solid #ccc',
  backgroundColor: '#ccc',
  width: 50,
  height: 50,
  borderRadius: '50%',
  marginBottom: '20px',
})

const AddLiquidityDialog = ({
  token1,
  token2,
  onChangeToken1,
  onChangeToken2,
  isOpen,
  onClose,
}) => {
  return (
    <Dialog isShowing={isOpen} onRequestClose={onClose} css={{width: 'unset'}}>
      <DialogHeader paddingBottom={'$8'}>
        <Text variant="header">Add Liquidity</Text>
      </DialogHeader>
      <DialogContent css={{ padding: '$6 0' }}>
        <StyledDivForWrapper>
          <TokenSelector
            tokenSymbol={token1.tokenSymbol}
            amount={token1.amount}
            onChange={onChangeToken1}
          />
          <TokenSelector
            tokenSymbol={token2.tokenSymbol}
            amount={token2.amount}
            onChange={onChangeToken2}
          />
        </StyledDivForWrapper>
      </DialogContent>
      <DialogDivider offsetTop="$16" offsetBottom="$8" />

      <DialogButtons
        confirmationButton={
          <Button variant="secondary" onClick={onClose}>
            Done
          </Button>
        }
      />
    </Dialog>
  )
}

const StyledDivForWrapper = styled('div', {
  borderRadius: '8px',
  // backgroundColor: '$colors$dark10',
})
