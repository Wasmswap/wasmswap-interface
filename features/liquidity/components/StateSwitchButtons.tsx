import { styled } from 'components/theme'
import { SecondaryButton } from './SecondaryButton'

type StateSwitchButtonsProps = {
  activeValue: string
  values: Array<string>
  onStateChange: (state: string) => void
}

export const StateSwitchButtons = ({
  activeValue,
  values,
  onStateChange,
}: StateSwitchButtonsProps) => {
  return (
    <StyledDivForGrid>
      {values.map((value) => (
        <SecondaryButton
          key={value}
          active={value === activeValue}
          onClick={() => {
            onStateChange(value)
          }}
        >
          {value}
        </SecondaryButton>
      ))}
    </StyledDivForGrid>
  )
}

const StyledDivForGrid = styled('div', {
  display: 'flex',
  alignItems: 'center',
  columnGap: '4px',
  '& *': {
    textTransform: 'capitalize',
  },
})
