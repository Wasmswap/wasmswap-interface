import { styled } from '@stitches/react'
import { useIBCAssetInfo } from 'hooks/useIBCAssetInfo'
import { Text } from '../../../components/Text'
import { IconWrapper } from '../../../components/IconWrapper'
import { DoubleArrow } from '../../../icons/DoubleArrow'
import { colorTokens } from '../../../util/constants'
import { HTMLProps } from 'react'
import { __TRANSFERS_ENABLED__ } from '../../../util/constants'

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

  return (
    <StyledElementForCard {...(htmlProps as any)} kind="wrapper">
      <StyledElementForCard kind="content">
        <StyledElementForToken>
          <StyledTokenImage src={logoURI} />
          <Text variant="title">
            {balance} {name}{' '}
            {!__TRANSFERS_ENABLED__ && (
              <Text css={{ paddingLeft: '$8' }} as="span" variant="title">
                Coming soon
              </Text>
            )}
          </Text>
        </StyledElementForToken>
      </StyledElementForCard>

      <StyledElementForCard kind="actions">
        <StyledActionButton
          disabled={!__TRANSFERS_ENABLED__}
          onClick={__TRANSFERS_ENABLED__ ? handleDepositClick : undefined}
        >
          <IconWrapper size="16px" icon={<DoubleArrow />} />
          Deposit
        </StyledActionButton>
        <StyledActionButton
          disabled={!__TRANSFERS_ENABLED__}
          onClick={__TRANSFERS_ENABLED__ ? handleWithdrawClick : undefined}
        >
          <IconWrapper size="16px" icon={<DoubleArrow />} />
          Withdraw
        </StyledActionButton>
      </StyledElementForCard>

      {state === AssetCardState.active && (
        <StyledElementForCard kind="background" />
      )}
    </StyledElementForCard>
  )
}

const StyledElementForCard = styled('div', {
  variants: {
    kind: {
      wrapper: {
        background: 'rgba(25, 29, 32, 0.1)',
        borderRadius: '8px',
        padding: '18px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      },
      content: {
        display: 'grid',
        gridAutoFlow: 'column',
        columnGap: '21px',
        position: 'relative',
        zIndex: 1,
      },
      actions: {
        display: 'grid',
        gridAutoFlow: 'column',
        columnGap: '12px',
        position: 'relative',
        zIndex: 1,
      },
      background: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        background:
          'radial-gradient(92.33% 382.8% at 4.67% 100%, #DFB1E3 0%, rgba(247, 202, 178, 0) 100%)',
        opacity: 0.4,
      },
    },
  },
})

const StyledElementForToken = styled('div', {
  display: 'grid',
  gridAutoFlow: 'column',
  columnGap: '7px',
  alignItems: 'center',
})

const StyledTokenImage = styled('img', {
  width: 26,
  height: 26,
  borderRadius: '50%',
  backgroundColor: '#ccc',
})

const StyledActionButton = styled('button', {
  display: 'grid',
  gridAutoFlow: 'column',
  columnGap: '5px',
  alignItems: 'center',
  transition: 'color .15s ease-out',
  fontSize: '17px',
  lineHeight: '20px',
  fontWeight: 500,
  '&:hover': {
    color: colorTokens.gray,
  },

  variants: {
    disabled: {
      true: {
        color: colorTokens.gray,
        cursor: 'not-allowed',
      },
    },
  },
})
