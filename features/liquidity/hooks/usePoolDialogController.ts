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
import { usePriceForOneToken } from '../../swap/hooks/usePriceForOneToken'
import { getSwapInfo } from '../../../services/swap'

type UsePoolDialogControllerArgs = {
  /* value from 0 to 1 */
  percentage: number
  actionState: 'add' | 'remove'
  tokenInfo: TokenInfo
}

export const usePoolDialogController = ({
  actionState,
  percentage,
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

  const [oneTokenToTokenPrice] = usePriceForOneToken({
    tokenASymbol: tokenB?.symbol,
    tokenBSymbol: tokenA?.symbol,
  })

  const maxApplicableBalanceForTokenA = Math.min(
    tokenABalance * oneTokenToTokenPrice,
    tokenABalance
  )

  const maxApplicableBalanceForTokenB = Math.min(
    maxApplicableBalanceForTokenA / oneTokenToTokenPrice,
    tokenBBalance
  )

  const tokenAReserve = myReserve?.[0]
    ? convertMicroDenomToDenom(myReserve[0], tokenA.decimals)
    : 0
  const tokenBReserve = myReserve?.[1]
    ? convertMicroDenomToDenom(myReserve[1], tokenB.decimals)
    : 0

  const refetchQueries = useRefetchQueries()

  const {
    isLoading,
    reset: resetAddLiquidityMutation,
    mutate: mutateAddLiquidity,
  } = useMutation(
    async () => {
      const { lp_token_address } = await getSwapInfo(
        tokenB.swap_address,
        process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT
      )

      const tokenAAmount = percentage * maxApplicableBalanceForTokenA
      const tokenBAmount = percentage * maxApplicableBalanceForTokenB

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
          amount: Math.floor(percentage * myLiquidity.coins),
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

  return {
    state: {
      myLiquidity,
      myReserve,
      tokenAReserve,
      tokenBReserve,
      isLoading,
      tokenASymbol: tokenA.symbol,
      tokenABalance: tokenABalance,
      tokenBBalance,
      maxApplicableBalanceForTokenA,
      maxApplicableBalanceForTokenB,
      oneTokenToTokenPrice,
    },
    actions: {
      mutateAddLiquidity,
    },
  }
}
