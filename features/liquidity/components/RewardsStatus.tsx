import { Inline } from 'components/Inline'
import { Text } from 'components/Text'
import { ImageForTokenLogo } from 'components/ImageForTokenLogo'
import { Button } from 'components/Button'
import { Column } from '../../../components/Column'
import { Divider } from '../../../components/Divider'
import React from 'react'

export const RewardsStatus = ({
  tokenA,
  tokenB,
  disabled = false,
  size = 'large',
}) => {
  if (size === 'small') {
    return (
      <>
        <Column gap={4} css={{ paddingTop: '$20' }}>
          <Text variant="primary">Liquidity rewards</Text>
          {!disabled && (
            <Text variant="legend" color="brand">
              Next reward: $32 in 4hrs
            </Text>
          )}
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
            <Text variant="header">$289.00</Text>
            <Button variant="primary">Claim reward</Button>
          </Inline>
          <Divider />
        </Column>
      </>
    )
  }

  return (
    <>
      <Inline justifyContent="space-between" css={{ padding: '$20 0 $4' }}>
        <Text variant="primary">Liquidity rewards</Text>
        {disabled && <Text variant="legend">No rewards expected</Text>}
        {!disabled && (
          <Text variant="legend" color="brand">
            Next reward: $32 in 4hrs
          </Text>
        )}
      </Inline>
      {!disabled && (
        <Inline justifyContent="space-between" css={{ padding: '$12 0' }}>
          <Inline gap={16}>
            <Text variant="header">$289.00</Text>
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
          <Button variant="primary">Claim reward</Button>
        </Inline>
      )}
      <Divider />
    </>
  )
}
