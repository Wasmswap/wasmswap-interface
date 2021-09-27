import { Dialog, DialogBody } from './Dialog'
import { Text } from './Text'
import styled from 'styled-components'
import { LiquidityInput } from './LiquidityInput'
import { Link } from './Link'
import { Button } from './Button'

export const PoolDialog = ({ isShowing, onRequestClose }) => {
  return (
    <Dialog isShowing={isShowing} onRequestClose={onRequestClose}>
      <DialogBody>
        <StyledTitle>Juno / Atom</StyledTitle>
        <LiquidityInput
          tokenName="Juno"
          liquidity={1.23131}
          amount={1}
          ratio={50}
          onAmountChange={(val) => console.log(val)}
        />
        <LiquidityInput
          tokenName="Atom"
          liquidity={1.23131}
          amount={1}
          ratio={50}
          onAmountChange={(val) => console.log(val)}
        />
        <Link
          color="lightBlue"
          onClick={() => console.log('add maximum amounts')}
        >
          Add maximum amounts
        </Link>
        <StyledButton size="humongous">Add Liquidity</StyledButton>
      </DialogBody>
    </Dialog>
  )
}

const StyledTitle = styled(Text)`
  padding-bottom: 24px;
  text-align: center;
`
const StyledButton = styled(Button)`
  margin-top: 32px;
`
