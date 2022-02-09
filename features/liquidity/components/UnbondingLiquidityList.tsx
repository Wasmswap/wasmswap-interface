import { UnbondingLiquidityCard } from './UnbondingLiquidityCard'
import React from 'react'
import { useStakingClaims } from 'features/liquidity/hooks'

export const UnbondingLiquidityList = ({ poolId, tokenA, tokenB, size }) => {
  const [{ allClaims }] = useStakingClaims({ poolId })

  return (
    <>
      {allClaims?.map(({ amount, release_at }, idx) => (
        <UnbondingLiquidityCard
          key={idx}
          tokenA={tokenA}
          tokenB={tokenB}
          size={size}
          poolId={poolId}
          amount={amount}
          releaseAt={release_at}
        />
      ))}
    </>
  )
}
