import { styled } from 'components/theme'
import { Text } from '../../../components/Text'

export const UnbondingLiquidityCard = () => {
  return (
    <StyledElementForCard kind="wrapper">
      <StyledElementForCard kind="content">
        <StyledElementForCard kind="columnLeft">
          <Text type="caption" color="secondaryText" variant="light">
            Unstaked tokens
          </Text>
          <Text type="caption" color="bodyText" variant="light">
            + $999.00
          </Text>
        </StyledElementForCard>
        <StyledElementForCard kind="columnRight">
          <Text type="caption" color="secondaryText" variant="light">
            12 hrs
          </Text>
        </StyledElementForCard>
      </StyledElementForCard>
      <StyledElementForBar kind="wrapper">
        <StyledElementForBar kind="element" />
      </StyledElementForBar>
    </StyledElementForCard>
  )
}

const StyledElementForCard = styled('div', {
  variants: {
    kind: {
      wrapper: {
        padding: '0 35px 12px 24px',
        borderRadius: '8px',
        border: '1px solid #E7E7E7',
        backgroundColor: 'rgba(25, 29, 32, 0.1)',
      },
      content: {
        padding: '20px 0',
        display: 'flex',
        justifyContent: 'space-between',
      },
      columnLeft: {
        display: 'grid',
        columnGap: '22px',
        gridAutoFlow: 'column',
        alignItems: 'center',
      },
      columnRight: {},
    },
  },
})

const StyledElementForBar = styled('div', {
  variants: {
    kind: {
      wrapper: {
        width: '100%',
        height: 4,
        background: '#C4C4C4',
        position: 'relative',
        overflow: 'hidden',
      },
      element: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        background: '#161616',
        transform: 'translate(-10%)',
      },
    },
  },
})
