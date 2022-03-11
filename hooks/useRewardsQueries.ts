import { useMutation, useQueries, useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'
import {
  claimRewards,
  getPendingRewards,
  getRewardsInfo,
} from 'services/rewards'
import { walletState, WalletStatusType } from 'state/atoms/walletAtoms'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from 'util/constants'
import { convertMicroDenomToDenom } from 'util/conversion'
import { useChainInfo } from './useChainInfo'
import { useRewardContractsList } from './useRewardContractsList'
import { useCallback } from 'react'
import { cosmWasmClientRouter } from '../util/cosmWasmClientRouter'
import { useTokenList } from './useTokenList'
import { useBaseTokenInfo } from './useTokenInfo'
import { tokenToTokenPriceQuery } from '../queries/tokenToTokenPriceQuery'
import { useTokenDollarValue } from './useTokenDollarValue'

export const usePendingRewards = ({ swapAddress }) => {
  const { address, status, client } = useRecoilValue(walletState)

  const [getRewardsContract, enabled] = useGetRewardsContractBySwapAddress()
  const [getTokenInfoByDenom, enabledTokenInfoByDenomSearch] =
    useGetTokenInfoByDenom()
  const [getTokenDollarValue, enabledTokenDollarValueQuery] =
    useGetTokenDollarValue()

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

type UseMultipleRewardsInfoArgs = {
  swapAddresses: Array<string>
  refetchInBackground?: boolean
}

export const useMultipleRewardsInfo = ({
  swapAddresses,
  refetchInBackground = false,
}: UseMultipleRewardsInfoArgs) => {
  const [chainInfo] = useChainInfo()
  const [getRewardsContract, enabledRewardsContractsQuery] =
    useGetRewardsContractBySwapAddress()
  const [getTokenInfoByDenom, enabledTokenInfoSearch] = useGetTokenInfoByDenom()
  const [getTokenDollarValue, enabledTokenDollarValueQuery] =
    useGetTokenDollarValue()

  return useQueries(
    (swapAddresses ?? [])?.map((swapAddress) => ({
      queryKey: `rewardsInfo/${swapAddress}`,
      async queryFn() {
        const rewardsContract = getRewardsContract({ swapAddress })
        if (rewardsContract) {
          const client = await cosmWasmClientRouter.connect(chainInfo.rpc)
          const rewardsContractsInfo = await Promise.all(
            rewardsContract.rewards_tokens.map(({ rewards_address }) =>
              getRewardsInfo(rewards_address, client)
            )
          )

          const serializedContractsInfo = await Promise.all(
            rewardsContractsInfo.map(async (contractInfo) => {
              const tokenInfo = getTokenInfoByDenom({
                denom: contractInfo.config.reward_token,
              })

              const rewardRatePerBlockInTokens = convertMicroDenomToDenom(
                contractInfo.reward.rewardRate,
                tokenInfo.decimals
              )

              const rewardRatePerBlockInDollarValue = await getTokenDollarValue(
                {
                  tokenInfo,
                  tokenAmountInDenom: rewardRatePerBlockInTokens,
                }
              )

              const blocksPerSecond = 6
              const blocksPerYear = (525600 * 60) / blocksPerSecond

              const rewardRate = {
                ratePerBlock: {
                  tokens: rewardRatePerBlockInTokens,
                  dollarValue: rewardRatePerBlockInDollarValue,
                },
                ratePerYear: {
                  tokens: rewardRatePerBlockInTokens * blocksPerYear,
                  dollarValue: rewardRatePerBlockInDollarValue * blocksPerYear,
                },
              }

              return {
                contract: contractInfo,
                rewardRate,
                tokenInfo,
              }
            })
          )

          return {
            contracts: serializedContractsInfo,
            swap_address: swapAddress,
          }
        }

        return undefined
      },
      enabled:
        Boolean(chainInfo?.rpc) &&
        enabledRewardsContractsQuery &&
        enabledTokenInfoSearch &&
        enabledTokenDollarValueQuery,
      refetchInterval: refetchInBackground
        ? DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL
        : undefined,
      refetchIntervalInBackground: refetchInBackground,
      refetchOnMount: false,
    }))
  )
}

export const useRewardsInfo = ({ swapAddress }) => {
  const [response] =
    useMultipleRewardsInfo({ swapAddresses: [swapAddress] }) || []

  return [response?.data, response?.isLoading]
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

const useGetTokenDollarValue = () => {
  const tokenA = useBaseTokenInfo()
  const [chainInfo, fetchingChainInfo] = useChainInfo()
  const [tokenADollarPrice, fetchingDollarPrice] = useTokenDollarValue(
    tokenA?.symbol
  )

  return [
    async function getTokenDollarValue({ tokenInfo, tokenAmountInDenom }) {
      const priceForOneToken = await tokenToTokenPriceQuery({
        baseToken: tokenA,
        fromTokenInfo: tokenA,
        toTokenInfo: tokenInfo,
        chainInfo,
        amount: 1,
      })

      return tokenAmountInDenom * (priceForOneToken * tokenADollarPrice)
    },
    Boolean(tokenA && !fetchingChainInfo && !fetchingDollarPrice),
  ] as const
}
