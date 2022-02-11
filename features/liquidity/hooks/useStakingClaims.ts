import { Claim, getClaims } from 'services/staking'
import { useTokenInfoByPoolId } from 'hooks/useTokenInfo'
import { useRecoilValue } from 'recoil'
import { walletState, WalletStatusType } from 'state/atoms/walletAtoms'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from 'util/constants'

type StakingClaimsType = {
  redeemableClaims?: Array<Claim>
  awaitedClaims?: Array<Claim>
  allClaims?: Array<Claim>
}

export const useStakingClaims = ({ poolId }) => {
  const token = useTokenInfoByPoolId(poolId)
  const { address, status, client } = useRecoilValue(walletState)

  const { data = {} as StakingClaimsType, isLoading } =
    useQuery<StakingClaimsType>(
      [`claims/${poolId}`, address],
      async () => {
        const claims = await getClaims(address, token.staking_address, client)

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
        enabled: Boolean(
          token?.staking_address && status === WalletStatusType.connected
        ),
        refetchOnMount: 'always',
        refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
        refetchIntervalInBackground: true,
      }
    )

  return [data, isLoading] as const
}
