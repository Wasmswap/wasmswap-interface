import {
  queryRewardsContracts,
  QueryRewardsContractsArgs,
} from './queryRewardsContracts'

export function calculateRewardsAnnualYieldRate({
  rewardsContracts,
  totalStakedDollarValue,
}) {
  /* rewards math */
  return rewardsContracts.contracts.reduce(
    (yieldReturnValue, rewardsContract) => {
      return (
        yieldReturnValue +
        rewardsContract.rewardRate.ratePerYear.dollarValue /
          totalStakedDollarValue
      )
    },
    0
  )
}

export async function queryRewardsAnnualYieldRate({
  totalStakedDollarValue,
  ...rewardsQueryArgs
}: QueryRewardsContractsArgs & { totalStakedDollarValue: number }) {
  const rewardsContracts = await queryRewardsContracts(rewardsQueryArgs)
  return calculateRewardsAnnualYieldRate({
    rewardsContracts,
    totalStakedDollarValue,
  })
}
