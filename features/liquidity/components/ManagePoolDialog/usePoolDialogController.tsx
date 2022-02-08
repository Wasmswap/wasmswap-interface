import { useRecoilValue } from 'recoil'
import { walletState } from 'state/atoms/walletAtoms'
import { useBaseTokenInfo } from 'hooks/useTokenInfo'
import { useTokenBalance } from 'hooks/useTokenBalance'
import { usePoolLiquidity } from 'hooks/usePoolLiquidity'
import { useMutation } from 'react-query'
import { addLiquidity, removeLiquidity } from 'services/liquidity'
import {
  convertDenomToMicroDenom,
  convertMicroDenomToDenom,
} from 'util/conversion'
import { toast } from 'react-hot-toast'
import { useRefetchQueries } from 'hooks/useRefetchQueries'
import { getSwapInfo } from 'services/swap'
import { useChainInfo } from 'hooks/useChainInfo'
import { TokenInfo } from 'hooks/useTokenList'
import { Toast } from 'components/Toast'
import { IconWrapper } from 'components/IconWrapper'
import { Valid } from 'icons/Valid'
import { Error } from 'icons/Error'
import { Button } from 'components/Button'
import { UpRightArrow } from 'icons/UpRightArrow'

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

  const [{ myLiquidity, myReserve, reserve } = {} as any] = usePoolLiquidity({
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
  const [chainInfo] = useChainInfo()

  const mutation = useMutation(
    async () => {
      const { lp_token_address } = await getSwapInfo(
        tokenB.swap_address,
        chainInfo.rpc
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
        const errorMessage =
          String(e).length > 300
            ? `${String(e).substring(0, 150)} ... ${String(e).substring(
                String(e).length - 150
              )}`
            : String(e)

        toast.custom((t) => (
          <Toast
            icon={<IconWrapper icon={<Error />} color="error" />}
            title={`Couldn't ${
              actionState === 'add' ? 'Add' : 'Remove'
            } liquidity`}
            body={errorMessage}
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
