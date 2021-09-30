import { Dialog, DialogBody } from './Dialog'
import { useQuery, useMutation, useQueryClient } from 'react-query'
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
import { Spinner } from './Spinner'

export const PoolDialog = ({ isShowing, onRequestClose, tokenInfo }) => {
  const { address, client } = useRecoilValue(walletState)

  const { data: { token_reserve, native_reserve } = {} } = useQuery(
    `getSwapInfo/${tokenInfo.swap_address}`,
    () =>
      getSwapInfo(
        tokenInfo.swap_address,
        process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT
      )
  )

  const { data: junoBalance = 0 } = useQuery('junoBalance', async () => {
    if (address) {
      const coin = await client.getBalance(address, 'ujuno')
      const amount = coin ? Number(coin.amount) : 0
      return amount / 1000000
    }
    return 0
  })

  const { data: tokenBalance = 0 } = useQuery(
    `${tokenInfo.symbol}Balance`,
    async () => {
      if (address) {
        const balance = await CW20(client)
          .use(tokenInfo.token_address)
          .balance(address)
        return Number(balance) / 1000000
      }
      return 0
    }
  )

  const queryClient = useQueryClient()
  const { isLoading, mutateAsync: mutateAsyncAddLiquidity } = useMutation(
    () => {
      return addLiquidity({
        nativeAmount: Math.floor(tokenAAmount * 1000000),
        nativeDenom: 'ujuno',
        maxToken: Math.floor(tokenBAmount * 1000000 + 5),
        minLiquidity: 0,
        swapAddress: tokenInfo.swap_address,
        senderAddress: address,
        tokenAddress: tokenInfo.token_address,
        client: client,
      })
    },
    {
      onSuccess: () => {
        const queriesToInvalidate = [
          'getSwapInfo',
          `myLiquidity/${tokenInfo.symbol}`,
          `totalLiquidity/${tokenInfo.symbol}`,
          'junoBalance',
          `${tokenInfo.symbol}Balance`,
        ]
        queriesToInvalidate.forEach((queryName) => {
          queryClient.invalidateQueries(queryName)
        })
      },
    }
  )

  const [tokenAAmount, setTokenAAmount] = useState(1)
  const [tokenBAmount, setTokenBAmount] = useState(1)

  const handleTokenAAmountChange = (val: number) => {
    setTokenAAmount(val)
    setTokenBAmount((Number(token_reserve) / Number(native_reserve)) * val)
  }

  const handleTokenBAmountChange = (val: number) => {
    setTokenBAmount(val)
    setTokenAAmount((Number(native_reserve) / Number(token_reserve)) * val)
  }

  const executeAddLiquidity = async () => {
    try {
      await mutateAsyncAddLiquidity()
      toast.success('🎉 Add Successful', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      requestAnimationFrame(onRequestClose)
    } catch (e) {
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
          {`Juno / ${formatTokenName(tokenInfo.symbol)}`}
        </StyledTitle>
        <LiquidityInput
          tokenName="Juno"
          balance={junoBalance ? junoBalance : 0}
          amount={tokenAAmount}
          ratio={50}
          onAmountChange={handleTokenAAmountChange}
        />
        <LiquidityInput
          tokenName={formatTokenName(tokenInfo.symbol)}
          balance={tokenBalance ? tokenBalance : 0}
          amount={tokenBAmount}
          ratio={50}
          onAmountChange={handleTokenBAmountChange}
        />
        <Link
          color="lightBlue"
          onClick={() => handleTokenAAmountChange(junoBalance)}
        >
          Add maximum amounts
        </Link>
        <StyledButton
          size="humongous"
          onClick={isLoading ? undefined : executeAddLiquidity}
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : 'Add Liquidity'}
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
