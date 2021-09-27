import styled from 'styled-components'
import { colorTokens } from '../../util/constants'
import { Text } from '../Text'
import { Button } from '../Button'

export const PoolCard = ({
  tokenAName,
  tokenBName,
  availableLiquidity,
  liquidity,
}) => {
  return (
    <StyledDivForCard>
      <StyledDivForTitle>
        <div>
          <Text variant="bold">{tokenAName}</Text>
          <Text color="gray" type="caption">
            50%
          </Text>
        </div>
        <Text variant="bold">{' / '}</Text>
        <div>
          <Text variant="bold">{tokenBName}</Text>
          <Text color="gray" type="caption">
            50%
          </Text>
        </div>
      </StyledDivForTitle>
      <StyledTextForAvailableLiquidity
        color="gray"
        type="caption"
        variant="light"
      >
        Total liquidity:{' '}
        {availableLiquidity.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}
      </StyledTextForAvailableLiquidity>
      <StyledDivForDivider />
      <StyledDivForFooter>
        <div data-my-liquidity="">
          <Text color="gray" type="caption" variant="normal">
            My liquidity
          </Text>
          <StyledTextForLiquidity>
            {liquidity.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </StyledTextForLiquidity>
        </div>
        <Button size="small">Join</Button>
      </StyledDivForFooter>
    </StyledDivForCard>
  )
}

const StyledDivForCard = styled.div`
  border-radius: 6px;
  border: 1px solid ${colorTokens.primary};
  padding: 16px 24px;
`

const StyledDivForTitle = styled.div`
  display: flex;
  align-items: flex-start;
  width: 50%;
  justify-content: space-between;
`

const StyledTextForAvailableLiquidity = styled(Text)`
  padding-top: 16px;
`

const StyledDivForDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colorTokens.gray};
  margin: 16px 0;
`

const StyledTextForLiquidity = styled(Text)`
  padding-top: 2px;
`
const StyledDivForFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`
