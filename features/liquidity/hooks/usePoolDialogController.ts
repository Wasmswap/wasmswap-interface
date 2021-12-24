import { useRecoilValue } from 'recoil'
import { walletState } from 'state/atoms/walletAtoms'
import { getBaseToken, TokenInfo } from 'hooks/useTokenInfo'
import { useTokenBalance } from 'hooks/useTokenBalance'
import { usePoolLiquidity } from 'hooks/usePoolLiquidity'
import { useMutation } from 'react-query'
import { addLiquidity, removeLiquidity } from 'services/liquidity'
import {
  convertDenomToMicroDenom,
  convertMicroDenomToDenom,
} from 'util/conversion'
import { toast } from 'react-toastify'
import { useRefetchQueries } from 'hooks/useRefetchQueries'
import { useState } from 'react'
import { useTokenToTokenPrice } from '../../swap/hooks/useTokenToTokenPrice'
import { useSwapInfo } from 'hooks/useSwapInfo'

type UsePoolDialogControllerArgs = {
  removeLiquidityPercent: number
  actionState: 'add' | 'remove'
  tokenInfo: TokenInfo
}

export const usePoolDialogController = ({
  removeLiquidityPercent,
  actionState,
  tokenInfo: tokenB,
}: UsePoolDialogControllerArgs) => {
  const { address, client } = useRecoilValue(walletState)

  const tokenA = getBaseToken()
  const { balance: tokenABalance } = useTokenBalance(tokenA.symbol)
  const { balance: tokenBBalance } = useTokenBalance(tokenB.symbol)

  const [liquidity] = usePoolLiquidity({
    poolIds: [tokenB.pool_id],
  })

  const { myLiquidity, myReserve } = liquidity?.[0] ?? {}

  const [{ token2_reserve, token1_reserve, lp_token_address }] = useSwapInfo({
    tokenSymbol: tokenB.symbol,
  })

  const refetchQueries = useRefetchQueries()

  const {
    isLoading,
    reset: resetAddLiquidityMutation,
    mutate: mutateAddLiquidity,
  } = useMutation(
    async () => {
      if (actionState === 'add') {
        return await addLiquidity({
          nativeAmount: Math.floor(
            convertDenomToMicroDenom(tokenAAmount, getBaseToken().decimals)
          ),
          nativeDenom: getBaseToken().denom,
          maxToken: Math.floor(
            convertDenomToMicroDenom(tokenBAmount, tokenB.decimals) + 5
          ),
          minLiquidity: 0,
          swapAddress: tokenB.swap_address,
          senderAddress: address,
          tokenAddress: tokenB.token_address,
          tokenDenom: tokenB.denom,
          tokenNative: tokenB.native,
          client,
        })
      } else {
        return await removeLiquidity({
          amount: Math.floor(
            (removeLiquidityPercent / 100) * myLiquidity.coins
          ),
          minToken1: 0,
          minToken2: 0,
          swapAddress: tokenB.swap_address,
          senderAddress: address,
          lpTokenAddress: lp_token_address,
          client,
        })
      }
    },
    {
      onSuccess() {
        // show toast
        toast.success(
          `🎉 ${actionState === 'add' ? 'Add' : 'Remove'} Successful`,
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        )

        refetchQueries()
        setTimeout(resetAddLiquidityMutation, 350)
      },
      onError(error) {
        console.error(error)
        toast.error(
          `Couldn't ${
            actionState === 'add' ? 'Add' : 'Remove'
          } liquidity because of: ${error}`,
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        )
      },
    }
  )

  const [tokenAAmount, setTokenAAmount] = useState(0)
  const [tokenBAmount, setTokenBAmount] = useState(0)

  const [tokenPrice] = useTokenToTokenPrice({
    tokenASymbol: tokenA.symbol,
    tokenBSymbol: tokenB.symbol,
    tokenAmount: 1,
  })

  const hasMoreBaseTokenValue = tokenABalance * tokenPrice > tokenBBalance

  const maxApplicableBalanceForBaseToken = hasMoreBaseTokenValue
    ? tokenABalance - (tokenABalance - tokenBBalance / tokenPrice)
    : tokenABalance

  const maxApplicableBalanceForToken = hasMoreBaseTokenValue
    ? tokenBBalance
    : tokenBBalance - (tokenBBalance - tokenABalance * tokenPrice)

  const handleTokenAAmountChange = (input: number) => {
    const value =
      input > maxApplicableBalanceForBaseToken
        ? maxApplicableBalanceForBaseToken
        : input
    setTokenAAmount(value)
    setTokenBAmount((Number(token2_reserve) / Number(token1_reserve)) * value)
  }

  const handleTokenBAmountChange = (input: number) => {
    const value =
      input > maxApplicableBalanceForToken
        ? maxApplicableBalanceForToken
        : input
    setTokenBAmount(value)
    setTokenAAmount((Number(token1_reserve) / Number(token2_reserve)) * value)
  }

  const handleApplyMaximumAmount = () => {
    handleTokenAAmountChange(maxApplicableBalanceForBaseToken)
  }

  const tokenAReserve = myReserve?.[0]
    ? convertMicroDenomToDenom(myReserve[0], tokenA.decimals)
    : 0
  const tokenBReserve = myReserve?.[1]
    ? convertMicroDenomToDenom(myReserve[1], tokenB.decimals)
    : 0

  return {
    state: {
      myLiquidity,
      myReserve,
      tokenAReserve,
      tokenBReserve,
      isLoading,
      tokenASymbol: tokenA.symbol,
      tokenABalance: tokenABalance,
      tokenAAmount,
      tokenBAmount,
      tokenBBalance,
    },
    actions: {
      handleTokenAAmountChange,
      handleTokenBAmountChange,
      handleApplyMaximumAmount,
      mutateAddLiquidity,
    },
  }
}
