import { Inline } from '../../../components/Inline'
import { Text } from '../../../components/Text'
import { ImageForTokenLogo } from '../../../components/ImageForTokenLogo'
import { Button } from '../../../components/Button'
import React from 'react'

export const UnbondingStatus = ({ tokenA, tokenB }) => (
  <>
    <Text variant="primary" css={{ padding: '$20 0 $4' }}>
      Unbonding tokens
    </Text>
    <Inline justifyContent="space-between" css={{ padding: '$12 0' }}>
      <Inline gap={16}>
        <Text variant="header">$34.77</Text>
        <Inline gap={3}>
          <ImageForTokenLogo
            size="large"
            logoURI={tokenA.logoURI}
            alt={tokenA.symbol}
          />
          <Text variant="link">86.931234</Text>
        </Inline>
        <Inline gap={3}>
          <ImageForTokenLogo
            size="large"
            logoURI={tokenB.logoURI}
            alt={tokenB.symbol}
          />
          <Text variant="link">61.821204</Text>
        </Inline>
      </Inline>
      <Button variant="primary">Redeem</Button>
    </Inline>
  </>
)
