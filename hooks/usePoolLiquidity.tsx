import { useQuery } from 'react-query'
import { getSwapInfo, InfoResponse } from '../services/swap'
import { getLiquidityBalance } from '../services/liquidity'
import { useRecoilValue } from 'recoil'
import { walletState } from '../state/atoms/walletAtoms'
import { getBaseToken, getTokenInfoByPoolId } from './useTokenInfo'
import { useTokenDollarValue } from './useTokenDollarValue'
import { convertMicroDenomToDenom, protectAgainstNaN } from 'util/conversion'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '../util/constants'

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

export const usePoolLiquidity = ({
  poolIds,
}): readonly [LiquidityInfoType[] | undefined, boolean] => {
  const { address } = useRecoilValue(walletState)

  const { data: swaps = [], isLoading: fetchingSwaps } = useQuery(
    `swapInfo/${poolIds?.join('+')}`,
    async () => {
      const swaps: Array<InfoResponse> = await Promise.all(
        poolIds
          .map((poolId) => getTokenInfoByPoolId(poolId).swap_address)
          .map((swap_address) =>
            getSwapInfo(
              swap_address,
              process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT
            )
          )
      )

      return swaps.map((swap) => ({
        ...swap,
        token1_reserve: Number(swap.token1_reserve),
        token2_reserve: Number(swap.token2_reserve),
        lp_token_supply: Number(swap.lp_token_supply),
      }))
    },
    {
      enabled: Boolean(poolIds?.length),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

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
            rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT,
          })
        )
      )

      return balances.map((balance) => Number(balance))
    },
    {
      enabled: Boolean(swaps?.length && address),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  const [[junoPrice]] = useTokenDollarValue([getBaseToken().symbol])

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

      const baseTokenDecimals = getBaseToken().decimals

      const totalLiquidity = {
        coins: lp_token_supply,
        dollarValue:
          convertMicroDenomToDenom(reserve[0], baseTokenDecimals) *
          junoPrice *
          2,
      }

      const myLiquidity = {
        coins: balance,
        dollarValue:
          convertMicroDenomToDenom(myReserve[0], baseTokenDecimals) *
          junoPrice *
          2,
      }

      return {
        reserve,
        myReserve,
        totalLiquidity,
        myLiquidity,
        tokenDollarValue: junoPrice,
      }
    }
  )

  return [liquidity, fetchingMyLiquidity || fetchingSwaps] as const
}
