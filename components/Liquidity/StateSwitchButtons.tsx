import { styled } from '@stitches/react'
import { SecondaryButton } from './SecondaryButton'

type SwitchStates = 'stake' | 'unstake'

type StateSwitchButtonsProps = {
  value: SwitchStates
  onStateChange: (state: SwitchStates) => void
}

export const StateSwitchButtons = ({
  value,
  onStateChange,
}: StateSwitchButtonsProps) => {
  return (
    <StyledDivForGrid>
      <SecondaryButton
        active={value === 'stake'}
        onClick={() => {
          onStateChange('stake')
        }}
      >
        Staking
      </SecondaryButton>
      <SecondaryButton
        active={value === 'unstake'}
        onClick={() => {
          onStateChange('unstake')
        }}
      >
        Unstaking
      </SecondaryButton>
    </StyledDivForGrid>
  )
}

const StyledDivForGrid = styled('div', {
  display: 'flex',
  alignItems: 'center',
  columnGap: '4px',
})
