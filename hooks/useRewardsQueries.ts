import { useWallet } from '@noahsaso/cosmodal'
import { useMutation, useQuery } from 'react-query'
import { claimRewards, getPendingRewards } from 'services/rewards'
import {
  __POOL_REWARDS_ENABLED__,
  DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
} from 'util/constants'
import { convertMicroDenomToDenom } from 'util/conversion'

import { useGetTokenDollarValueQuery } from '../queries/useGetTokenDollarValueQuery'
import { PoolEntityTypeWithLiquidity } from '../queries/useQueryPools'
import { useTokenList } from './useTokenList'

type UsePendingRewardsArgs = {
  pool: PoolEntityTypeWithLiquidity
}

export const usePendingRewards = ({ pool }: UsePendingRewardsArgs) => {
  const { address, connected, signingCosmWasmClient } = useWallet()

  const [getTokenInfoByDenom, enabledTokenInfoByDenomSearch] =
    useGetTokenInfoByDenom()
  const [getTokenDollarValue, enabledTokenDollarValueQuery] =
    useGetTokenDollarValueQuery()

  const shouldQueryRewards =
    pool?.rewards_tokens?.length > 0 && pool?.staking_address

  const { data: rewards, isLoading } = useQuery(
    `pendingRewards/${pool?.pool_id}/${address}/${shouldQueryRewards}`,
    async () => {
      if (shouldQueryRewards) {
        return await Promise.all(
          pool.rewards_tokens.map(async ({ rewards_address, decimals }) => {
            const { pending_rewards, denom } = await getPendingRewards(
              address,
              rewards_address,
              signingCosmWasmClient
            )

            const tokenInfo = getTokenInfoByDenom({ denom })
            const tokenAmount = convertMicroDenomToDenom(
              Number(pending_rewards),
              decimals ?? tokenInfo.decimals
            )

            return {
              tokenAmount,
              tokenInfo,
              dollarValue: await getTokenDollarValue({
                tokenInfo,
                tokenAmountInDenom: tokenAmount,
              }),
            }
          })
        )
      }
    },
    {
      enabled: Boolean(
        pool &&
          __POOL_REWARDS_ENABLED__ &&
          shouldQueryRewards &&
          enabledTokenInfoByDenomSearch &&
          enabledTokenDollarValueQuery &&
          connected
      ),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return [rewards, isLoading] as const
}

type UseClaimRewardsArgs = {
  pool: PoolEntityTypeWithLiquidity
} & Parameters<typeof useMutation>[2]

export const useClaimRewards = ({ pool, ...options }: UseClaimRewardsArgs) => {
  const { address, connected, signingCosmWasmClient } = useWallet()
  const [pendingRewards] = usePendingRewards({
    pool,
  })

  return useMutation(
    `@claim-rewards/${pool?.pool_id}`,
    async () => {
      const hasPendingRewards =
        __POOL_REWARDS_ENABLED__ &&
        pendingRewards?.find(({ tokenAmount }) => tokenAmount > 0)

      const shouldBeAbleToClaimRewards = pool && connected && hasPendingRewards

      if (shouldBeAbleToClaimRewards) {
        const rewardsAddresses = pool.rewards_tokens
          /*
           * filter out rewards contracts that don't have pending rewards accumulated just yet.
           * */
          .filter((token) => {
            const pendingRewardsForToken = pendingRewards.find(
              ({ tokenInfo }) => token.symbol === tokenInfo.symbol
            )

            return pendingRewardsForToken.tokenAmount > 0
          })
          .map(({ rewards_address }) => rewards_address)

        return await claimRewards(
          address,
          rewardsAddresses,
          signingCosmWasmClient
        )
      }
    },
    options
  )
}

const useGetTokenInfoByDenom = () => {
  const [tokenList] = useTokenList()
  return [
    function getTokenInfoByDenom({ denom: tokenDenom }) {
      return tokenList.tokens.find(({ denom, token_address }) => {
        if ('native' in tokenDenom) {
          return tokenDenom.native === denom
        }
        if ('cw20' in tokenDenom) {
          return tokenDenom.cw20 === token_address
        }
      })
    },
    Boolean(tokenList?.tokens),
  ] as const
}
