import { UnbondingLiquidityCard } from './UnbondingLiquidityCard'
import React from 'react'
import { useGetClaims } from 'hooks/useStakedToken'

export const UnbondingLiquidityList = ({ poolId, tokenA, tokenB, size }) => {
  const [claims] = useGetClaims({ poolId })

  return (
    <>
      {claims?.map(({ amount, release_at }, idx) => (
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
