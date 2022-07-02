import { useWallet } from '@noahsaso/cosmodal'
import dayjs from 'dayjs'
import { useQuery } from 'react-query'
import { Claim, getClaims } from 'services/staking'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from 'util/constants'

import { usePoolFromListQueryById } from '../../../queries/usePoolsListQuery'

type StakingClaimsType = {
  redeemableClaims?: Array<Claim>
  awaitedClaims?: Array<Claim>
  allClaims?: Array<Claim>
}

export const useStakingClaims = ({ poolId }) => {
  const [pool] = usePoolFromListQueryById({ poolId })
  const { address, connected, signingCosmWasmClient } = useWallet()

  const { data = {} as StakingClaimsType, isLoading } =
    useQuery<StakingClaimsType>(
      `@staking-claims/${poolId}/${address}`,
      async () => {
        const claims = await getClaims(
          address,
          pool.staking_address,
          signingCosmWasmClient
        )

        return claims.reduce(
          (claims, claim) => {
            const isClaimRedeemable = dayjs(claim.release_at).diff(dayjs()) <= 0

            if (isClaimRedeemable) {
              claims.redeemableClaims.push(claim)
            } else {
              claims.awaitedClaims.push(claim)
            }

            return claims
          },
          {
            redeemableClaims: [] as Array<Claim>,
            awaitedClaims: [] as Array<Claim>,
            allClaims: claims,
          }
        )
      },
      {
        enabled: Boolean(pool?.staking_address && connected),
        refetchOnMount: 'always',
        refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
        refetchIntervalInBackground: true,
      }
    )

  return [data, isLoading] as const
}
