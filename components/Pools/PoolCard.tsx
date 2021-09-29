import styled from 'styled-components'
import { useQuery } from 'react-query'
import { colorTokens } from '../../util/constants'
import { Text } from '../Text'
import { Button } from '../Button'
import { getSwapInfo } from 'services/swap'
import { getLiquidityBalance } from 'services/liquidity'
import { useRecoilValue } from 'recoil'
import { walletState } from 'state/atoms/walletAtoms'

export const PoolCard = ({
  tokenAName,
  tokenBName,
  tokenInfo,
  onButtonClick,
}) => {
  const { address } = useRecoilValue(walletState)

  const swapInfoQuery = useQuery(`totalLiquidity${tokenBName}`, () =>
    getSwapInfo(
      tokenInfo.swap_address,
      process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT
    ).then((res) => res)
  )

  const myLiquidityQuery = useQuery([`myLiquidity${tokenBName}`, address, swapInfoQuery.data], () => {
      console.log('fetching')
      
      return getLiquidityBalance({
        address: address,
        swapAddress: tokenInfo.swap_address,
        rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT,
      }).then((res) => (res.balance/+swapInfoQuery.data.lp_token_supply) * +swapInfoQuery.data.native_reserve * 2)
  })

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
        {swapInfoQuery.data
          ? ((+swapInfoQuery.data.native_reserve * 2) / 1000000).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })
          : 0}
      </StyledTextForAvailableLiquidity>
      <StyledDivForDivider />
      <StyledDivForFooter>
        <div data-my-liquidity="">
          <Text color="gray" type="caption" variant="normal">
            My liquidity
          </Text>
          <StyledTextForLiquidity>
            {myLiquidityQuery.data
              ? (+myLiquidityQuery.data).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })
              : 0}
          </StyledTextForLiquidity>
        </div>
        <Button onClick={onButtonClick} size="small">
          Join
        </Button>
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
