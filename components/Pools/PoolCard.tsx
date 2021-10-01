import styled from 'styled-components'
import { colorTokens } from '../../util/constants'
import { Text } from '../Text'
import { Button } from '../Button'
import { useRecoilValue } from 'recoil'
import { walletState } from 'state/atoms/walletAtoms'
import { useLiquidity } from '../../hooks/useLiquidity'

const parseCurrency = (value: number | string) =>
  Number(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })

export const PoolCard = ({
  tokenAName,
  tokenBName,
  tokenInfo,
  onButtonClick,
}) => {
  const { address } = useRecoilValue(walletState)

  const { totalLiquidity, myLiquidity } = useLiquidity({
    tokenName: tokenBName,
    swapAddress: tokenInfo.swap_address,
    address,
  })

  return (
    <StyledDivForCard>
      <StyledDivForContent>
        <StyledDivForTitle>
          <div>
            <Text variant="normal">{tokenAName}</Text>
            <Text color="gray" type="caption" variant="light">
              50%
            </Text>
          </div>
          <StyledDivForTitleSeparator>
            <Text variant="normal">{' / '}</Text>
          </StyledDivForTitleSeparator>
          <div>
            <Text variant="normal">{tokenBName}</Text>
            <Text color="gray" type="caption" variant="light">
              50%
            </Text>
          </div>
        </StyledDivForTitle>
        <StyledTextForAvailableLiquidity type="caption" variant="light">
          Total liquidity: {parseCurrency(totalLiquidity)}
        </StyledTextForAvailableLiquidity>
      </StyledDivForContent>
      <StyledDivForDivider />
      <StyledDivForFooter>
        <div data-my-liquidity="">
          <Text color="gray" type="caption" variant="light">
            My liquidity
          </Text>
          <StyledTextForLiquidity>
            {parseCurrency(myLiquidity || 0)}
          </StyledTextForLiquidity>
        </div>
        <Button onClick={onButtonClick} size="small">
          {typeof myLiquidity === 'number' ? 'Manage' : 'Join'}
        </Button>
      </StyledDivForFooter>
    </StyledDivForCard>
  )
}

const paddingX = 24

const StyledDivForCard = styled.div`
  border-radius: 6px;
  padding: 32px 0;
  background-color: ${colorTokens.white};
`

const StyledDivForTitle = styled.div`
  text-transform: uppercase;
  display: flex;
  align-items: flex-start;
  width: 50%;
  justify-content: space-between;
`

const StyledDivForTitleSeparator = styled.div``

const StyledTextForAvailableLiquidity = styled(Text)`
  padding-top: 16px;
`

const StyledDivForDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colorTokens.gray};
  margin: 14px 0;
`

const StyledTextForLiquidity = styled(Text)`
  padding-top: 2px;
`
const StyledDivForFooter = styled.div`
  padding: 0 ${paddingX}px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`

const StyledDivForContent = styled.div`
  padding: 0 ${paddingX}px;
`
