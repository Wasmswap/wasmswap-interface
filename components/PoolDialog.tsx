import styled from 'styled-components'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Dialog, DialogBody } from './Dialog'
import { Text } from './Text'
import { LiquidityInput } from './LiquidityInput'
import { Link } from './Link'
import { Button } from './Button'
import { formatTokenName } from 'util/conversion'
import { walletState } from 'state/atoms/walletAtoms'
import { useState } from 'react'
import { getSwapInfo } from 'services/swap'
import { addLiquidity } from 'services/liquidity'
import { Spinner } from './Spinner'
import {
  useInvalidateBalances,
  useTokenBalance,
} from '../hooks/useTokenBalance'
import { useTokenInfo } from '../hooks/useTokenInfo'
import { useInvalidateLiquidity } from '../hooks/useLiquidity'

export const PoolDialog = ({ isShowing, onRequestClose, tokenInfo }) => {
  const { address, client } = useRecoilValue(walletState)

  const { balance: junoBalance } = useTokenBalance(useTokenInfo('JUNO'))
  const { balance: tokenBalance } = useTokenBalance(tokenInfo)

  const invalidateBalances = useInvalidateBalances()
  const invalidateLiquidity = useInvalidateLiquidity()

  const { data: { token_reserve, native_reserve } = {} } = useQuery(
    `swapInfo/${tokenInfo.swap_address}`,
    async () => {
      return await getSwapInfo(
        tokenInfo.swap_address,
        process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT
      )
    },
    {
      enabled: Boolean(tokenInfo.swap_address),
    }
  )

  const queryClient = useQueryClient()
  const {
    isLoading,
    reset: resetAddLiquidityMutation,
    mutate: mutateAddLiquidity,
  } = useMutation(
    async () => {
      return await addLiquidity({
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
      onSuccess() {
        // show toast
        toast.success('🎉 Add Successful', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })

        // close modal
        requestAnimationFrame(onRequestClose)
      },
      onError(error) {
        toast.error(`Couldn't add liquidity because of: ${error}`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      },
      onSettled() {
        queryClient.refetchQueries('swapInfo')
        invalidateBalances()
        invalidateLiquidity()
        setTimeout(resetAddLiquidityMutation, 350)
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
          onClick={isLoading ? undefined : mutateAddLiquidity}
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
