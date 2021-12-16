import { useQuery } from 'react-query'
import { getSwapInfo } from '../services/swap'
import { getLiquidityBalance } from '../services/liquidity'
import { useRecoilValue } from 'recoil'
import { walletState } from '../state/atoms/walletAtoms'
import { getBaseToken, useTokenInfoByPoolId } from './useTokenInfo'
import { useTokenDollarValue } from './useTokenDollarValue'

export type LiquidityInfoType = {
  reserve: [number, number]
  myReserve: [number, number]
  totalLiquidity: {
    coins: number
    dollarValue: number
  }
  myLiquidity: {
    coins: number
    dollarValue: number
  }
  /* pretty hacky - refactor when implementing decimals support */
  tokenDollarValue: number
}

const protectAgainstNaN = (value: number) => (isNaN(value) ? 0 : value)

export const usePoolLiquidity = ({
  poolId,
}): LiquidityInfoType & { isLoading: boolean } => {
  const { address } = useRecoilValue(walletState)

  const { swap_address, symbol: tokenSymbol } =
    useTokenInfoByPoolId(poolId) || {}

  const {
    data: {
      token1_reserve,
      token2_reserve,
      lp_token_supply,
      lp_token_address,
    } = {},
    isLoading: fetchingTotalLiquidity,
  } = useQuery(
    [`swapInfo/${tokenSymbol}`, swap_address],
    async () => {
      return await getSwapInfo(
        swap_address,
        process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT
      )
    },
    {
      enabled: Boolean(swap_address),
    }
  )

  const { data: myLiquidityCoins, isLoading: fetchingMyLiquidity } = useQuery(
    [
      `myLiquidity/${tokenSymbol}`,
      address,
      token1_reserve,
      lp_token_supply,
      lp_token_address,
    ],
    async () => {
      const balance = await getLiquidityBalance({
        address: address,
        tokenAddress: lp_token_address,
        rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT,
      })

      return Number(balance)
    },
    {
      enabled: Boolean(
        swap_address && address && token1_reserve && lp_token_supply
      ),
    }
  )

  const [[junoPrice]] = useTokenDollarValue([getBaseToken().symbol])

  /* provide dollar value for reserves as well */
  const reserve: [number, number] = [
    protectAgainstNaN(Number(token1_reserve)),
    protectAgainstNaN(Number(token2_reserve)),
  ]

  const myReserve: [number, number] = [
    protectAgainstNaN(
      reserve[0] * (myLiquidityCoins / Number(lp_token_supply))
    ),
    protectAgainstNaN(
      reserve[1] * (myLiquidityCoins / Number(lp_token_supply))
    ),
  ]

  const totalLiquidity = {
    coins: Number(lp_token_supply),
    dollarValue: (reserve[0] / 1000000) * junoPrice * 2,
  }

  const myLiquidity = {
    coins: myLiquidityCoins,
    dollarValue: (myReserve[0] / 1000000) * junoPrice * 2,
  }

  return {
    reserve,
    myReserve,
    totalLiquidity,
    myLiquidity,
    /* pretty hacky - refactor when implementing decimals support */
    tokenDollarValue: junoPrice,
    isLoading: fetchingMyLiquidity || fetchingTotalLiquidity,
  }
}
