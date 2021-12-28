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
import { getSwapInfo } from '../../../../services/swap'

type UsePoolDialogControllerArgs = {
  /* value from 0 to 1 */
  percentage: number
  actionState: 'add' | 'remove'
  tokenInfo: TokenInfo
}

function calculateMaxApplicableBalances({
  availableReserve,
  tokenABalance,
  tokenBBalance,
}) {
  const tokenAToTokenBRatio = availableReserve?.[0] / availableReserve?.[1]
  const tokenABalanceMinusGasFee = Math.max(tokenABalance - 0.1, 0)

  const isTokenALimitingFactor =
    tokenABalance < tokenBBalance * tokenAToTokenBRatio

  if (isTokenALimitingFactor) {
    return {
      tokenA: tokenABalanceMinusGasFee,
      tokenB: Math.min(
        tokenABalanceMinusGasFee / tokenAToTokenBRatio,
        tokenBBalance
      ),
    }
  }

  return {
    tokenA: Math.min(tokenBBalance * tokenAToTokenBRatio, tokenABalance),
    tokenB: tokenBBalance,
  }
}

export const usePoolDialogController = ({
  actionState,
  percentage,
  tokenInfo: tokenB,
}: UsePoolDialogControllerArgs) => {
  const tokenA = getBaseToken()
  const { balance: tokenABalance } = useTokenBalance(tokenA.symbol)
  const { balance: tokenBBalance } = useTokenBalance(tokenB.symbol)

  const [{ myLiquidity, myReserve, reserve } = {} as any] = usePoolLiquidity({
    poolId: tokenB.pool_id,
  })

  const {
    tokenA: maxApplicableBalanceForTokenA,
    tokenB: maxApplicableBalanceForTokenB,
  } = calculateMaxApplicableBalances({
    availableReserve: reserve,
    tokenABalance,
    tokenBBalance,
  })

  const tokenAReserve = myReserve?.[0]
    ? convertMicroDenomToDenom(myReserve[0], tokenA.decimals)
    : 0
  const tokenBReserve = myReserve?.[1]
    ? convertMicroDenomToDenom(myReserve[1], tokenB.decimals)
    : 0

  const { isLoading, mutate: mutateAddLiquidity } = useMutateLiquidity({
    actionState,
    percentage,
    tokenA,
    tokenB,
    maxApplicableBalanceForTokenA,
    maxApplicableBalanceForTokenB,
    myLiquidity,
  })

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
    },
    actions: {
      mutateAddLiquidity,
    },
  }
}

const useMutateLiquidity = ({
  percentage,
  maxApplicableBalanceForTokenA,
  maxApplicableBalanceForTokenB,
  tokenA,
  tokenB,
  actionState,
  myLiquidity,
}) => {
  const { address, client } = useRecoilValue(walletState)
  const refetchQueries = useRefetchQueries()

  const mutation = useMutation(
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
            convertDenomToMicroDenom(tokenAAmount, tokenA.decimals)
          ),
          nativeDenom: tokenA.denom,
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
        setTimeout(mutation.reset, 350)
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

  return mutation
}
