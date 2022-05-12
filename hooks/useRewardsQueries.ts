import { useCallback } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'
import { claimRewards, getPendingRewards } from 'services/rewards'
import { walletState, WalletStatusType } from 'state/atoms/walletAtoms'
import {
  __POOL_REWARDS_ENABLED__,
  DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
} from 'util/constants'
import { convertMicroDenomToDenom } from 'util/conversion'

import { useGetTokenDollarValueQuery } from '../queries/useGetTokenDollarValueQuery'
import { useRewardContractsList } from './useRewardContractsList'
import { useTokenList } from './useTokenList'

export const usePendingRewards = ({ swapAddress }) => {
  const { address, status, client } = useRecoilValue(walletState)

  const [getRewardsContract, enabled] = useGetRewardsContractBySwapAddress()
  const [getTokenInfoByDenom, enabledTokenInfoByDenomSearch] =
    useGetTokenInfoByDenom()
  const [getTokenDollarValue, enabledTokenDollarValueQuery] =
    useGetTokenDollarValueQuery()

  const { data: rewards, isLoading } = useQuery(
    [`pendingRewards/${swapAddress}`, address],
    async () => {
      const rewardsContract = getRewardsContract({ swapAddress })
      return await Promise.all(
        rewardsContract.rewards_tokens.map(
          async ({ rewards_address, decimals }) => {
            const { pending_rewards, denom } = await getPendingRewards(
              address,
              rewards_address,
              client
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
          }
        )
      )
    },
    {
      enabled: Boolean(
        __POOL_REWARDS_ENABLED__ &&
          enabled &&
          enabledTokenInfoByDenomSearch &&
          swapAddress &&
          enabledTokenDollarValueQuery &&
          status === WalletStatusType.connected
      ),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return [rewards, isLoading]
}

type UseClaimRewardsArgs = {
  swapAddress: string
} & Parameters<typeof useMutation>[2]

export const useClaimRewards = ({
  swapAddress,
  ...options
}: UseClaimRewardsArgs) => {
  const { address, client } = useRecoilValue(walletState)
  const [getRewardsContract] = useGetRewardsContractBySwapAddress()

  return useMutation(
    `@claim-rewards/${swapAddress}`,
    async () => {
      const rewardsContract = getRewardsContract({ swapAddress })
      const rewardsAddresses = rewardsContract.rewards_tokens.map(
        ({ rewards_address }) => rewards_address
      )
      return await claimRewards(address, rewardsAddresses, client)
    },
    options
  )
}

const useGetRewardsContractBySwapAddress = () => {
  const [rewardsContracts] = useRewardContractsList()

  return [
    useCallback(
      function selectRewardsContract({ swapAddress }) {
        return rewardsContracts?.find(
          ({ swap_address }) => swap_address === swapAddress
        )
      },
      [rewardsContracts]
    ),
    Boolean(rewardsContracts?.length),
  ] as const
}

const useGetTokenInfoByDenom = () => {
  const [tokenList, fetching] = useTokenList()
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
    !fetching,
  ] as const
}
