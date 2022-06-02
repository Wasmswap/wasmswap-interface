import { useRefetchQueries } from 'hooks/useRefetchQueries'
import { useSwapInfo } from 'hooks/useSwapInfo'
import { useTokenBalance } from 'hooks/useTokenBalance'
import {
  Button,
  Error,
  IconWrapper,
  Toast,
  UpRightArrow,
  Valid,
} from 'junoblocks'
import { PoolEntityTypeWithLiquidity } from 'queries/useQueryPools'
import { toast } from 'react-hot-toast'
import { useMutation } from 'react-query'
import { useRecoilValue } from 'recoil'
import { executeAddLiquidity, executeRemoveLiquidity } from 'services/liquidity'
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
  pool: PoolEntityTypeWithLiquidity
}

export const usePoolDialogController = ({
  actionState,
  percentage,
  pool,
}: UsePoolDialogControllerArgs) => {
  const {
    liquidity,
    pool_assets: [tokenA, tokenB],
  } = pool || { pool_assets: [] }

  const { balance: tokenABalance } = useTokenBalance(tokenA.symbol)
  const { balance: tokenBBalance } = useTokenBalance(tokenB.symbol)

  function calculateMaxApplicableBalances() {
    // Decimal converted reserves
    const tokenAReserve = convertMicroDenomToDenom(
      liquidity?.reserves?.total[0],
      tokenA.decimals
    )
    const tokenBReserve = convertMicroDenomToDenom(
      liquidity?.reserves?.total[1],
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

  const tokenAReserve = liquidity.reserves?.provided[0]
    ? convertMicroDenomToDenom(liquidity.reserves?.provided[0], tokenA.decimals)
    : 0
  const tokenBReserve = liquidity.reserves?.provided[1]
    ? convertMicroDenomToDenom(liquidity.reserves?.provided[1], tokenB.decimals)
    : 0

  const { isLoading, mutate: mutateAddLiquidity } = useMutateLiquidity({
    pool,
    actionState,
    percentage,
    tokenA,
    tokenB,
    maxApplicableBalanceForTokenA,
    maxApplicableBalanceForTokenB,
    providedLiquidity: liquidity?.available?.provided,
  })

  return {
    state: {
      providedLiquidity: liquidity?.available?.provided,
      providedLiquidityReserve: liquidity?.reserves?.provided,
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
  pool,
  percentage,
  maxApplicableBalanceForTokenA,
  maxApplicableBalanceForTokenB,
  tokenA,
  tokenB,
  actionState,
  providedLiquidity,
}) => {
  const { address, client } = useRecoilValue(walletState)
  const refetchQueries = useRefetchQueries(['tokenBalance', 'myLiquidity'])

  const [swap] = useSwapInfo({
    poolId: pool.pool_id,
  })

  const mutation = useMutation(
    async () => {
      const { lp_token_address } = swap

      const tokenAAmount = percentage * maxApplicableBalanceForTokenA
      const tokenBAmount = percentage * maxApplicableBalanceForTokenB

      if (actionState === 'add') {
        return executeAddLiquidity({
          tokenA,
          tokenB,
          tokenAAmount: Math.floor(
            convertDenomToMicroDenom(tokenAAmount, tokenA.decimals)
          ),
          maxTokenBAmount: Math.ceil(
            convertDenomToMicroDenom(tokenBAmount, tokenB.decimals)
          ),
          swapAddress: pool.swap_address,
          senderAddress: address,
          client,
        })
      } else {
        return executeRemoveLiquidity({
          tokenAmount: Math.floor(percentage * providedLiquidity.tokenAmount),
          swapAddress: pool.swap_address,
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
