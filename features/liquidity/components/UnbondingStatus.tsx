import { Inline } from 'components/Inline'
import { Text } from 'components/Text'
import { ImageForTokenLogo } from 'components/ImageForTokenLogo'
import { Button } from 'components/Button'
import React from 'react'
import { Divider } from '../../../components/Divider'
import { Column } from '../../../components/Column'

export const UnbondingStatus = ({ tokenA, tokenB, size = 'large' }) => {
  if (size === 'small') {
    return (
      <Column gap={4} css={{ padding: '$20 0 $8' }}>
        <Text variant="primary">Unbonding tokens</Text>
        <Inline
          css={{
            rowGap: '$8',
            columnGap: '$12',
            flexWrap: 'wrap',
            padding: '$12 0',
          }}
        >
          {[tokenA, tokenB, tokenA, tokenB].map((token, key) => (
            <Inline gap={3} key={key}>
              <ImageForTokenLogo
                size="large"
                logoURI={token.logoURI}
                alt={token.symbol}
              />
              <Text variant="link">86.931234</Text>
            </Inline>
          ))}
        </Inline>
        <Divider />
        <Inline justifyContent="space-between" css={{ padding: '$12 0' }}>
          <Text variant="header">$237.00</Text>
          <Button variant="primary">Redeem</Button>
        </Inline>
        <Divider />
      </Column>
    )
  }
  return (
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
      <Divider offsetBottom="$8" />
    </>
  )
}
