import { Button, IconWrapper, Toast } from 'components'
import { usePoolLiquidity } from 'hooks/usePoolLiquidity'
import { useRefetchQueries } from 'hooks/useRefetchQueries'
import { useSwapInfo } from 'hooks/useSwapInfo'
import { useTokenBalance } from 'hooks/useTokenBalance'
import { useBaseTokenInfo } from 'hooks/useTokenInfo'
import { TokenInfo } from 'hooks/useTokenList'
import { Error, UpRightArrow, Valid } from 'icons'
import { toast } from 'react-hot-toast'
import { useMutation } from 'react-query'
import { useRecoilValue } from 'recoil'
import { addLiquidity, removeLiquidity } from 'services/liquidity'
import { walletState } from 'state/atoms/walletAtoms'
import {
  convertDenomToMicroDenom,
  convertMicroDenomToDenom,
} from 'util/conversion'
import { formatSdkErrorMessage } from 'util/formatSdkErrorMessage'

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
  const tokenA = useBaseTokenInfo()
  const { balance: tokenABalance } = useTokenBalance(tokenA.symbol)
  const { balance: tokenBBalance } = useTokenBalance(tokenB.symbol)

  const [{ myLiquidity, myLiquidityReserve, reserve } = {} as any] =
    usePoolLiquidity({
      poolId: tokenB.pool_id,
    })

  function calculateMaxApplicableBalances() {
    // Decimal converted reserves
    const tokenAReserve = convertMicroDenomToDenom(
      reserve?.[0],
      tokenA.decimals
    )
    const tokenBReserve = convertMicroDenomToDenom(
      reserve?.[1],
      tokenB.decimals
    )

    // TODO: Make slippage configurable
    const slippage = 0.99
    const tokenAToTokenBRatio = (tokenAReserve * slippage) / tokenBReserve
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

  const {
    tokenA: maxApplicableBalanceForTokenA,
    tokenB: maxApplicableBalanceForTokenB,
  } = calculateMaxApplicableBalances()

  const tokenAReserve = myLiquidityReserve?.[0]
    ? convertMicroDenomToDenom(myLiquidityReserve[0], tokenA.decimals)
    : 0
  const tokenBReserve = myLiquidityReserve?.[1]
    ? convertMicroDenomToDenom(myLiquidityReserve[1], tokenB.decimals)
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
      myLiquidityReserve,
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
  const refetchQueries = useRefetchQueries(['tokenBalance', 'myLiquidity'])

  const [swap] = useSwapInfo({
    tokenSymbol: tokenB.symbol,
  })

  const mutation = useMutation(
    async () => {
      const { lp_token_address } = swap

      const tokenAAmount = percentage * maxApplicableBalanceForTokenA
      const tokenBAmount = percentage * maxApplicableBalanceForTokenB

      if (actionState === 'add') {
        return await addLiquidity({
          nativeAmount: Math.floor(
            convertDenomToMicroDenom(tokenAAmount, tokenA.decimals)
          ),
          nativeDenom: tokenA.denom,
          maxToken: Math.ceil(
            convertDenomToMicroDenom(tokenBAmount, tokenB.decimals)
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
          amount: Math.floor(percentage * myLiquidity.tokenAmount),
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
        toast.custom((t) => (
          <Toast
            icon={<IconWrapper icon={<Valid />} color="valid" />}
            title={`${actionState === 'add' ? 'Add' : 'Remove'} Successful`}
            onClose={() => toast.dismiss(t.id)}
          />
        ))

        refetchQueries()
        setTimeout(mutation.reset, 350)
      },
      onError(e) {
        console.error(e)

        toast.custom((t) => (
          <Toast
            icon={<IconWrapper icon={<Error />} color="error" />}
            title={`Couldn't ${
              actionState === 'add' ? 'Add' : 'Remove'
            } liquidity`}
            body={formatSdkErrorMessage(e)}
            buttons={
              <Button
                as="a"
                variant="ghost"
                href={process.env.NEXT_PUBLIC_FEEDBACK_LINK}
                target="__blank"
                iconRight={<UpRightArrow />}
              >
                Provide feedback
              </Button>
            }
            onClose={() => toast.dismiss(t.id)}
          />
        ))
      },
    }
  )

  return mutation
}
