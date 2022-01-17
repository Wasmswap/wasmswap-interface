import { styled } from '@stitches/react'
import { useIBCAssetInfo } from 'hooks/useIBCAssetInfo'
import { Button } from 'components/Button'
import { Text } from '../../../components/Text'
import { IconWrapper } from '../../../components/IconWrapper'
import { HTMLProps } from 'react'
import { __TRANSFERS_ENABLED__ } from '../../../util/constants'
import { ArrowUp } from '../../../icons'
import { useTokenDollarValue } from '../../../hooks/useTokenDollarValue'
import { dollarValueFormatterWithDecimals } from '../../../util/conversion'

export enum AssetCardState {
  fetching = 'FETCHING',
  active = 'ACTIVE',
}

type AssetCardProps = Exclude<HTMLProps<HTMLDivElement>, 'children'> & {
  tokenSymbol?: string
  onActionClick?: (args: {
    tokenSymbol: string
    actionType: 'deposit' | 'withdraw'
  }) => void
  balance?: number
  state?: AssetCardState
}

export const AssetCard = ({
  tokenSymbol,
  onActionClick,
  balance,
  state,
  ...htmlProps
}: AssetCardProps) => {
  const { symbol, name, logoURI } = useIBCAssetInfo(tokenSymbol) || {}

  const [dollarValue] = useTokenDollarValue(tokenSymbol)

  const handleDepositClick = () =>
    onActionClick({
      tokenSymbol: symbol,
      actionType: 'deposit',
    })

  const handleWithdrawClick = () =>
    onActionClick({
      tokenSymbol: symbol,
      actionType: 'withdraw',
    })

  if (state === AssetCardState.fetching) {
    return (
      <StyledElementForCard {...(htmlProps as any)} kind="wrapper">
        <StyledElementForCard kind="content">
          <StyledElementForToken>
            <StyledTokenImage as="div" />
          </StyledElementForToken>
        </StyledElementForCard>
        <div />
      </StyledElementForCard>
    )
  }

  const rendersActiveAppearance = balance > 0

  return (
    <StyledElementForCard
      active={rendersActiveAppearance}
      {...(htmlProps as any)}
      kind="wrapper"
    >
      <StyledElementForCard kind="content">
        <StyledElementForToken>
          <StyledTokenImage src={logoURI} />
          <div>
            <Text variant="primary">
              {rendersActiveAppearance ? balance : null} {name}
            </Text>
            {rendersActiveAppearance && (
              <Text variant="caption" css={{ paddingTop: '$1' }}>
                $
                {dollarValueFormatterWithDecimals(dollarValue * balance, {
                  includeCommaSeparation: true,
                })}
              </Text>
            )}
          </div>
        </StyledElementForToken>
      </StyledElementForCard>

      <StyledElementForCard kind="actions">
        {balance > 0 && (
          <Button
            disabled={!__TRANSFERS_ENABLED__}
            onClick={__TRANSFERS_ENABLED__ ? handleWithdrawClick : undefined}
            iconRight={<IconWrapper icon={<ArrowUp />} />}
            variant="ghost"
          >
            Withdraw
          </Button>
        )}
        <Button
          disabled={!__TRANSFERS_ENABLED__}
          onClick={__TRANSFERS_ENABLED__ ? handleDepositClick : undefined}
          iconRight={<IconWrapper icon={<ArrowUp />} rotation="180deg" />}
          variant="ghost"
        >
          Deposit
        </Button>
      </StyledElementForCard>
    </StyledElementForCard>
  )
}

const StyledElementForCard = styled('div', {
  variants: {
    kind: {
      wrapper: {
        background: '$colors$dark10',
        borderRadius: '$2',
        padding: '$9 $12',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      },
      content: {
        display: 'grid',
        gridAutoFlow: 'column',
        columnGap: '$space$10',
        position: 'relative',
        zIndex: 1,
      },
      actions: {
        display: 'grid',
        gridAutoFlow: 'column',
        columnGap: '$space$6',
        position: 'relative',
        zIndex: 1,
      },
    },
    active: {
      true: {
        boxShadow: '$light',
        border: '1px solid $borderColors$default',
        backgroundColor: '$base',
      },
    },
  },
})

const StyledElementForToken = styled('div', {
  display: 'grid',
  gridAutoFlow: 'column',
  columnGap: '$6',
  alignItems: 'center',
})

const StyledTokenImage = styled('img', {
  width: 26,
  height: 26,
  borderRadius: '50%',
  backgroundColor: '#ccc',
})
