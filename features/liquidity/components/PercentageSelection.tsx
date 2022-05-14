import { Button, styled } from 'junoblocks'

type PercentageSelectionProps = {
  maxLiquidity: number
  liquidity: number
  onChangeLiquidity: (liquidity: number) => void
}

export const PercentageSelection = ({
  liquidity,
  onChangeLiquidity,
  maxLiquidity,
}: PercentageSelectionProps): JSX.Element => {
  const valuesForSteps = [0.1, 0.25, 0.5, 0.75, 1]
  const percentage = liquidity / maxLiquidity

  return (
    <StyledDivForGrid>
      {valuesForSteps.map((valueForStep) => {
        return (
          <Button
            size="small"
            variant="ghost"
            selected={percentage === valueForStep}
            key={valueForStep}
            onClick={() => {
              onChangeLiquidity(valueForStep * maxLiquidity)
            }}
          >
            {valueForStep * 100}%
          </Button>
        )
      })}
    </StyledDivForGrid>
  )
}

const StyledDivForGrid = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})
