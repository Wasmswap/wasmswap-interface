import styled from 'styled-components'
import { colorTokens, spaces } from 'util/constants'
import { Text } from 'components/Text'
import { Button } from '../../components/Button'

export const AssetCard = ({ tokenInfo: { name, symbol } }) => {
  return (
    <StyledWrapper>
      <StyledContent $enableSeparator>
        <StyledHeader>
          <StyledTokenAvatar />
          <StyledHeaderTextWrapper>
            <Text type="heading">{symbol}</Text>
            <Text type="body" variant="light">
              {name} mainnet
            </Text>
          </StyledHeaderTextWrapper>
        </StyledHeader>
      </StyledContent>
      <StyledContent>
        <Text paddingY={spaces[18]} type="caption" color="gray">
          Current balance
        </Text>
        <StyledBalanceWrapper>
          <Text type="title">34.3343</Text>
          <Text type="caption" paddingY="6px" paddingX="6px">
            {symbol}
          </Text>
        </StyledBalanceWrapper>
        <Text type="subtitle" variant="light">
          $116.33
        </Text>

        <StyledButtonsWrapper>
          <Button size="small">Deposit</Button>
          <Button size="small">Withdraw</Button>
        </StyledButtonsWrapper>
      </StyledContent>
    </StyledWrapper>
  )
}

const StyledButtonsWrapper = styled.div`
  display: grid;
  column-gap: 8px;
  grid-template-columns: 1fr 1fr;
  padding-top: 33px;
`

const StyledBalanceWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: ${spaces[24]};
`

const StyledHeaderTextWrapper = styled.div`
  padding-left: ${spaces[18]};
`

const StyledTokenAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
`

const StyledWrapper = styled.div`
  border-radius: 16px;
  border: 1px solid #e7e7e7;
  background-color: ${colorTokens.white};
  min-width: 280px;
  padding: 12px 0 18px;
`

const StyledContent = styled.div`
  width: 100%;
  padding: 0 18px;
  border-bottom: ${(p) => (p.$enableSeparator ? '1px solid #E6E6E6' : 'none')};
`
