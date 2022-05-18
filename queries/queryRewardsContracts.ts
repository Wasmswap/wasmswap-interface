import { getRewardsInfo, RewardsInfoResponse } from '../services/rewards'
import { convertMicroDenomToDenom } from '../util/conversion'
import { InternalQueryContext } from './types'
import { PoolEntityType, TokenInfoWithReward } from './usePoolsListQuery'
import { PoolTokenValue } from './useQueryPools'

const blocksPerSecond = 6
const blocksPerYear = (525600 * 60) / blocksPerSecond

export type QueryRewardsContractsArgs = {
  swapAddress: PoolEntityType['swap_address']
  rewardsTokens: PoolEntityType['rewards_tokens']
  context: InternalQueryContext
}

export type SerializedRewardsContract = {
  contract: RewardsInfoResponse
  tokenInfo: TokenInfoWithReward
  rewardRate: {
    ratePerBlock: PoolTokenValue
    ratePerYear: PoolTokenValue
  }
}

export async function queryRewardsContracts({
  rewardsTokens,
  context: { client, getTokenDollarValue },
}: QueryRewardsContractsArgs): Promise<Array<SerializedRewardsContract>> {
  const rewardsContractsInfo = await Promise.all(
    rewardsTokens.map(({ rewards_address }) =>
      getRewardsInfo(rewards_address, client)
    )
  )

  const currentHeight = await client.getHeight()

  return await Promise.all(
    rewardsContractsInfo.map(async (contractInfo, index) => {
      const tokenInfo = rewardsTokens[index]
      const expired = currentHeight > contractInfo.reward.period_finish

      const rewardRatePerBlockInTokens = expired
        ? 0
        : convertMicroDenomToDenom(
            contractInfo.reward.reward_rate,
            tokenInfo.decimals
          )

      const rewardRatePerBlockInDollarValue = expired
        ? 0
        : await getTokenDollarValue({
            tokenInfo,
            tokenAmountInDenom: rewardRatePerBlockInTokens,
          })

      const rewardRate = {
        ratePerBlock: {
          tokenAmount: rewardRatePerBlockInTokens,
          dollarValue: rewardRatePerBlockInDollarValue,
        },
        ratePerYear: {
          tokenAmount: rewardRatePerBlockInTokens * blocksPerYear,
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
}
