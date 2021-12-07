import { useRouter } from 'next/router'
import { AppLayout } from '../../components/Layout/AppLayout'
import { Text } from '../../components/Text'
import { styled } from '@stitches/react'
import { Chevron } from '../../icons/Chevron'
import { IconWrapper } from '../../components/IconWrapper'
import { PoolAvailableLiquidityCard } from '../../components/Pools/PoolAvailableLiquidityCard'
import { PoolBondedLiquidityCard } from '../../components/Pools/PoolBondedLiquidityCard'
import { Button } from '../../components/Button'
import { UnbondingLiquidityCard } from '../../components/Pools/UnbondingLiquidityCard'

export default function Pool() {
  const {
    query: { pool },
  } = useRouter()

  console.log({ pool })

  return (
    <AppLayout>
      <StyledWrapperForNavigation>
        <StyledNavElement position="left">
          <IconWrapper size="20px" icon={<Chevron />} />
        </StyledNavElement>
        <StyledNavElement position="center">
          <Text type="heading">Pool #1 Juno + Atom</Text>
        </StyledNavElement>
      </StyledWrapperForNavigation>

      <StyledDivForSeparator />

      <StyledRowForTokensInfo kind="wrapper">
        <StyledRowForTokensInfo kind="column">
          <Text paddingRight="26px">Pool #1</Text>
          <StyledTextForTokens kind="wrapper">
            <StyledTextForTokens kind="element">
              <StyledImageForToken src="/crab.png" />
              <Text color="bodyText" type="microscopic">
                Juno
              </Text>
            </StyledTextForTokens>
            <StyledTextForTokens kind="element">
              <StyledImageForToken src="/crab.png" />
              <Text color="bodyText" type="microscopic">
                Atom
              </Text>
            </StyledTextForTokens>
          </StyledTextForTokens>
        </StyledRowForTokensInfo>
        <StyledRowForTokensInfo kind="column">
          <Text type="microscopic" color="tertiaryText">
            1 juno = 32 atom
          </Text>
        </StyledRowForTokensInfo>
      </StyledRowForTokensInfo>

      <StyledDivForSeparator />

      <StyledElementForLiquidity kind="wrapper">
        <StyledElementForLiquidity kind="row">
          <Text
            type="caption"
            variant="light"
            color="secondaryText"
            paddingBottom="6px"
          >
            Total Liquidity
          </Text>
          <Text
            type="caption"
            variant="light"
            color="secondaryText"
            paddingBottom="6px"
          >
            APR reward
          </Text>
        </StyledElementForLiquidity>
        <StyledElementForLiquidity kind="row">
          <Text type="title3" variant="bold">
            $8,964,183.00
          </Text>
          <Text type="title3" variant="bold">
            159%
          </Text>
        </StyledElementForLiquidity>
      </StyledElementForLiquidity>

      <StyledDivForSeparator />

      <>
        <Text
          variant="bold"
          paddingTop="24px"
          paddingBottom="18px"
          color="bodyText"
        >
          Personal shares
        </Text>
        <StyledDivForCards>
          <PoolAvailableLiquidityCard />
          <PoolBondedLiquidityCard />
        </StyledDivForCards>
      </>

      <>
        <Text
          variant="bold"
          paddingTop="24px"
          paddingBottom="18px"
          color="bodyText"
        >
          Rewards
        </Text>
        <StyledDivForSeparator />
        <StyledElementForRewards kind="wrapper">
          <StyledElementForRewards kind="column">
            <Text type="title2">$289.00</Text>
          </StyledElementForRewards>

          <StyledElementForRewards kind="tokens">
            <StyledTextForTokens kind="element">
              <StyledImageForToken src="/crab.png" />
              <Text color="bodyText" type="microscopic">
                11 juno
              </Text>
            </StyledTextForTokens>
            <StyledTextForTokens kind="element">
              <StyledImageForToken src="/crab.png" />
              <Text color="bodyText" type="microscopic">
                31 atom
              </Text>
            </StyledTextForTokens>
          </StyledElementForRewards>

          <StyledElementForRewards kind="actions">
            <Button className="action-btn">Claim</Button>
          </StyledElementForRewards>
        </StyledElementForRewards>
        <StyledDivForSeparator />
      </>

      <>
        <Text
          variant="bold"
          paddingTop="24px"
          paddingBottom="18px"
          color="bodyText"
        >
          Unbonding Liquidity
        </Text>
        <StyledElementForUnbonding kind="list">
          <UnbondingLiquidityCard />
          <UnbondingLiquidityCard />
          <UnbondingLiquidityCard />
        </StyledElementForUnbonding>
      </>
    </AppLayout>
  )
}

const StyledWrapperForNavigation = styled('nav', {
  padding: '24px 0',
  display: 'flex',
  alignItems: 'center',
})

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

const StyledDivForSeparator = styled('hr', {
  margin: '0 auto',
  border: 'none',
  borderTop: '1px solid rgba(25, 29, 32, 0.1)',
  width: '100%',
  boxSizing: 'border-box',
  height: 1,
})

const StyledRowForTokensInfo = styled('div', {
  display: 'flex',
  alignItems: 'center',
  variants: {
    kind: {
      wrapper: {
        padding: '14px 0',
        justifyContent: 'space-between',
      },
      column: {},
    },
  },
})

const StyledTextForTokens = styled('div', {
  display: 'grid',
  gridAutoFlow: 'column',
  alignItems: 'center',

  variants: {
    kind: {
      element: {
        columnGap: '6px',
      },
      wrapper: {
        columnGap: '23px',
      },
    },
  },
})

const StyledImageForToken = styled('img', {
  width: 20,
  height: 20,
  borderRadius: '50%',
  backgroundColor: '#ccc',
})

const StyledElementForLiquidity = styled('div', {
  variants: {
    kind: {
      wrapper: {
        paddingTop: 22,
        paddingBottom: 28,
      },
      row: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    },
  },
})

const StyledDivForCards = styled('div', {
  display: 'grid',
  columnGap: '18px',
  gridTemplateColumns: '1fr 1fr',
})

const StyledElementForRewards = styled('div', {
  variants: {
    kind: {
      wrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 0',
      },
      tokens: {
        display: 'grid',
        columnGap: '32px',
        gridAutoFlow: 'column',
        alignItems: 'center',
      },
      column: {},
      actions: {
        '& .action-btn': {
          padding: '6px 32px',
          borderRadius: '8px',
        },
      },
    },
  },
})

const StyledElementForUnbonding = styled('div', {
  variants: {
    kind: {
      list: {
        display: 'grid',
        rowGap: '8px',
        paddingBottom: 24,
      },
    },
  },
})
