import { Dialog, DialogBody } from './Dialog'
import { useQuery } from 'react-query'
import { Text } from './Text'
import styled from 'styled-components'
import { LiquidityInput } from './LiquidityInput'
import { Link } from './Link'
import { Button } from './Button'
import { formatTokenName } from 'util/conversion'
import { useRecoilValue } from 'recoil'
import { walletState } from 'state/atoms/walletAtoms'
import { CW20 } from 'services/cw20'

export const PoolDialog = ({ isShowing, onRequestClose, tokenInfo}) => {
  const { address, client } = useRecoilValue(walletState)
  const junoBalanceQuery = useQuery(`junoBalance`, () =>{
    if(address) {
      return client.getBalance(address, 'ujuno').then(coin => {
        const res = coin ? +coin.amount : 0
        return res / 1000000
      })
    }
    return 0
  }
  )

  const tokenBalanceQuery = useQuery(`${tokenInfo.symbol}Balance`, () =>{
    if(address) {
      return CW20(client).use(tokenInfo.token_address).balance(address).then(res => +res / 1000000)
    }
    return 0
  }
  )
  return (
    <Dialog isShowing={isShowing} onRequestClose={onRequestClose}>
      <DialogBody>
        <StyledTitle> {`Juno / ${formatTokenName(tokenInfo.symbol)}`}</StyledTitle>
        <LiquidityInput
          tokenName="Juno"
          balance={junoBalanceQuery.data ? junoBalanceQuery.data : 0}
          amount={1}
          ratio={50}
          onAmountChange={(val) => console.log(val)}
        />
        <LiquidityInput
          tokenName={formatTokenName(tokenInfo.symbol)}
          balance={tokenBalanceQuery.data ? tokenBalanceQuery.data : 0}
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
