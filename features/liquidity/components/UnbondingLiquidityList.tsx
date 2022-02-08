import { UnbondingLiquidityCard } from './UnbondingLiquidityCard'
import React from 'react'
import { useGetClaims } from 'hooks/useStakedToken'

export const UnbondingLiquidityList = ({ poolId, tokenA, tokenB, size }) => {
  const [claims] = useGetClaims({ poolId })
  return (
    <>
      {claims?.map((_, idx) => (
        <UnbondingLiquidityCard
          key={idx}
          tokenA={tokenA}
          tokenB={tokenB}
          size={size}
        />
      ))}
    </>
  )
}
