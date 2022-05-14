import { Button, styled } from 'junoblocks'

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
        <Button
          variant="ghost"
          key={value}
          selected={value === activeValue}
          onClick={() => {
            onStateChange(value)
          }}
        >
          {value}
        </Button>
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
