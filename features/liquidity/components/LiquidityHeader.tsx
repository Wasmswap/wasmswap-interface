import { ArrowUp, Button, IconWrapper, Inline, styled, Text } from 'junoblocks'
import Link from 'next/link'
import React from 'react'

export const LiquidityHeader = ({ tokenA, tokenB, size = 'large' }) => {
  if (size === 'small') {
    return (
      <>
        <Text
          variant="header"
          transform="capitalize"
          css={{ padding: '$10 0' }}
        >
          Pool {tokenA.name} + {tokenB.name}
        </Text>
      </>
    )
  }

  return (
    <Inline css={{ padding: '$11 0' }}>
      <StyledNavElement position="left">
        <Link href="/pools" passHref>
          <Button
            iconLeft={<IconWrapper icon={<ArrowUp />} rotation="-90deg" />}
            variant="ghost"
            as="a"
          >
            Back
          </Button>
        </Link>
      </StyledNavElement>
      <StyledNavElement position="center">
        <Text variant="header" transform="capitalize">
          Pool {tokenA.name} + {tokenB.name}
        </Text>
      </StyledNavElement>
    </Inline>
  )
}

const StyledNavElement = styled('div', {
  display: 'flex',
  variants: {
    position: {
      left: {
        flex: 0.1,
        justifyContent: 'flex-start',
      },
      center: {
        flex: 0.8,
        justifyContent: 'center',
      },
      right: {
        flex: 0.1,
        justifyContent: 'flex-end',
      },
    },
  },
})
