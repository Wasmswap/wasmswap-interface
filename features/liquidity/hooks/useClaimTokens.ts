import { useTokenInfoByPoolId } from 'hooks/useTokenInfo'
import { useMutation } from 'react-query'
import { useRecoilValue } from 'recoil'
import { claimTokens } from 'services/staking'
import { walletState } from 'state/atoms/walletAtoms'

type UseClaimTokensMutationArgs = {
  poolId: string
} & Parameters<typeof useMutation>[2]

export const useClaimTokens = ({
  poolId,
  ...mutationArgs
}: UseClaimTokensMutationArgs) => {
  const { address, client } = useRecoilValue(walletState)
  const tokenInfo = useTokenInfoByPoolId(poolId)

  return useMutation(
    `claimTokens/${poolId}`,
    async () => {
      return claimTokens(address, tokenInfo.staking_address, client)
    },
    mutationArgs
  )
}
