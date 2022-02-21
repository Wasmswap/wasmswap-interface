import { useQuery } from 'react-query'
import { getLiquidityBalance } from '../services/liquidity'
import { useRecoilValue } from 'recoil'
import { walletState } from '../state/atoms/walletAtoms'
import { useBaseTokenInfo } from './useTokenInfo'
import { useTokenDollarValue } from './useTokenDollarValue'
import { convertMicroDenomToDenom, protectAgainstNaN } from 'util/conversion'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '../util/constants'
import { useBaseChainInfo } from './useChainInfo'
import { useMultipleSwapInfo } from './useSwapInfo'

export type LiquidityType = {
  coins: number
  dollarValue: number
}

export type LiquidityInfoType = {
  reserve: [number, number]
  myReserve: [number, number]
  totalLiquidity: LiquidityType
  myLiquidity: LiquidityType
  /* pretty hacky - refactor when implementing decimals support */
  tokenDollarValue: number
}

export const usePoolLiquidity = ({ poolId }) => {
  const [liquidity, isLoading] = useMultiplePoolsLiquidity({
    poolIds: poolId ? [poolId] : undefined,
    refetchInBackground: true,
  })

  return [liquidity?.[0], isLoading] as const
}

export const useMultiplePoolsLiquidity = ({
  poolIds,
  refetchInBackground = false,
}): readonly [LiquidityInfoType[] | undefined, boolean] => {
  const { address } = useRecoilValue(walletState)
  const [chainInfo] = useBaseChainInfo()

  const [swaps, fetchingSwaps] = useMultipleSwapInfo({
    poolIds,
    refetchInBackground,
  })

  const { data: myLiquidityCoins, isLoading: fetchingMyLiquidity } = useQuery(
    [
      `myLiquidity/${swaps
        ?.map(({ lp_token_address }) => lp_token_address)
        .join('+')}`,
      address,
    ],
    async () => {
      const balances = await Promise.all(
        swaps.map(({ lp_token_address }) =>
          getLiquidityBalance({
            address: address,
            tokenAddress: lp_token_address,
            rpcEndpoint: chainInfo.rpc,
          })
        )
      )

      return balances.map((balance) => Number(balance))
    },
    {
      enabled: Boolean(swaps?.length && address && chainInfo.rpc),
      refetchOnMount: 'always',
      refetchInterval: refetchInBackground
        ? DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL
        : undefined,
      refetchIntervalInBackground: refetchInBackground,
    }
  )

  const tokenA = useBaseTokenInfo()
  const [tokenADollarPrice] = useTokenDollarValue(tokenA?.symbol)

  const liquidity = swaps?.map(
    (
      { token1_reserve, token2_reserve, lp_token_supply },
      idx
    ): LiquidityInfoType => {
      const balance = myLiquidityCoins?.[idx] ?? 0

      /* provide dollar value for reserves as well */
      const reserve: [number, number] = [
        protectAgainstNaN(token1_reserve),
        protectAgainstNaN(token2_reserve),
      ]

      const myReserve: [number, number] = [
        protectAgainstNaN(reserve[0] * (balance / lp_token_supply)),
        protectAgainstNaN(reserve[1] * (balance / lp_token_supply)),
      ]

      const tokenADecimals = tokenA.decimals

      const totalLiquidity = {
        coins: lp_token_supply,
        dollarValue:
          convertMicroDenomToDenom(reserve[0], tokenADecimals) *
          tokenADollarPrice *
          2,
      }

      const myLiquidity = {
        coins: balance,
        dollarValue:
          convertMicroDenomToDenom(myReserve[0], tokenADecimals) *
          tokenADollarPrice *
          2,
      }

      return {
        reserve,
        myReserve,
        totalLiquidity,
        myLiquidity,
        tokenDollarValue: tokenADollarPrice,
      }
    }
  )

  return [liquidity, fetchingMyLiquidity || fetchingSwaps] as const
}
