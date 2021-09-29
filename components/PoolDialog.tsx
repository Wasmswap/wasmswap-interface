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
import { useState } from 'react'
import { getSwapInfo } from 'services/swap'
import { addLiquidity } from 'services/liquidity'
import { toast } from 'react-toastify'

export const PoolDialog = ({ isShowing, onRequestClose, tokenListInfo }) => {
  const { address, client } = useRecoilValue(walletState)

  const [tokenAAmount, setTokenAAmount] = useState(1)
  const [tokenBAmount, setTokenBAmount] = useState(1)

  const handleTokenAAmount = (val: number) => {
    setTokenAAmount(val)
    setTokenBAmount(
      (+getInfoQuery.data.token_reserve / +getInfoQuery.data.native_reserve) *
        val
    )
  }

  const handleTokenBAmount = (val: number) => {
    setTokenBAmount(val)
    setTokenAAmount(
      (+getInfoQuery.data.native_reserve / +getInfoQuery.data.token_reserve) *
        val
    )
  }

  const getInfoQuery = useQuery(`getInfo${tokenListInfo.swap_address}`, () =>
    getSwapInfo(
      tokenListInfo.swap_address,
      process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT
    ).then((res) => res)
  )

  const junoBalanceQuery = useQuery(`junoBalance`, () => {
    if (address) {
      return client.getBalance(address, 'ujuno').then((coin) => {
        const res = coin ? +coin.amount : 0
        return res / 1000000
      })
    }
    return 0
  })

  const tokenBalanceQuery = useQuery(`${tokenListInfo.symbol}Balance`, () => {
    if (address) {
      return CW20(client)
        .use(tokenListInfo.token_address)
        .balance(address)
        .then((res) => +res / 1000000)
    }
    return 0
  })

  const executeAddLiquidity = async () => {
    console.log('hello')
    try {
    await addLiquidity({
      nativeAmount: Math.floor(tokenAAmount * 1000000),
      nativeDenom: 'ujuno',
      maxToken: Math.floor(tokenBAmount * 1000000 + 5),
      minLiquidity: 0,
      swapAddress: tokenListInfo.swap_address,
      senderAddress: address,
      tokenAddress: tokenListInfo.token_address,
      client: client,
    })
    toast.success('🎉 Add Successful', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  } catch (e){
    toast.error(`Error with add ${e}`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }
  }

  return (
    <Dialog isShowing={isShowing} onRequestClose={onRequestClose}>
      <DialogBody>
        <StyledTitle>
          {' '}
          {`Juno / ${formatTokenName(tokenListInfo.symbol)}`}
        </StyledTitle>
        <LiquidityInput
          tokenName="Juno"
          balance={junoBalanceQuery.data ? junoBalanceQuery.data : 0}
          amount={tokenAAmount}
          ratio={50}
          onAmountChange={(val) => handleTokenAAmount(val)}
        />
        <LiquidityInput
          tokenName={formatTokenName(tokenListInfo.symbol)}
          balance={tokenBalanceQuery.data ? tokenBalanceQuery.data : 0}
          amount={tokenBAmount}
          ratio={50}
          onAmountChange={(val) => handleTokenBAmount(val)}
        />
        <Link
          color="lightBlue"
          onClick={() => console.log('add maximum amounts')}
        >
          Add maximum amounts
        </Link>
        <StyledButton
          size="humongous"
          onClick={() => executeAddLiquidity()}
        >
          Add Liquidity
        </StyledButton>
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
