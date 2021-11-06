import { CardWithSeparator } from '../CardWithSeparator'
import { Text } from '../Text'
import { CreditCardIcon } from '@heroicons/react/solid'
import styled from 'styled-components'
import { IconWrapper } from '../IconWrapper'
import { spaces } from '../../util/constants'
import { TokenAmountInput } from '../TokenAmountInput'
import { useState } from 'react'

export const WalletCardWithInput = ({}) => {
  const [amount, setAmount] = useState(100)
  return (
    <CardWithSeparator>
      {[
        <>
          <Text type="microscopic" variant="light">
            FROM
          </Text>
          <StyledHeader>
            <StyledIconWrapper
              size="44px"
              color="#1a44af"
              rounded
              icon={<CreditCardIcon />}
            />
            <div>
              <Text type="body" variant="light">
                Keplr wallet
              </Text>
              <Text
                type="microscopic"
                variant="normal"
                color="gray"
                paddingTop="2"
              >
                cosmos1uw6ls6y8du6d1uw6ls6y8du6d1uw6ls6y
              </Text>
            </div>
          </StyledHeader>
        </>,
        <>
          <StyledDivForBalance>
            <Text type="microscopic" variant="light">
              Max available:{' '}
            </Text>
            <Text
              type="microscopic"
              variant="normal"
              color="lightBlue"
              paddingLeft="2"
            >
              133 JUNO
            </Text>
          </StyledDivForBalance>
          <TokenAmountInput
            value={amount}
            onAmountChange={setAmount}
            maxValue={1000}
          />
        </>,
      ]}
    </CardWithSeparator>
  )
}

const StyledIconWrapper = styled(IconWrapper)`
  background: linear-gradient(
    143.8deg,
    rgba(119, 170, 203, 0.7) -8.73%,
    rgba(88, 144, 213, 0.7) 54.85%,
    rgba(159, 98, 186, 0.7) 91.29%
  );
  background-blend-mode: overlay, overlay, normal;
  padding: 7px;
  margin-right: ${spaces[12]};
`

const StyledHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: ${spaces[14]} 0 ${spaces[24]};
`

const StyledDivForBalance = styled.div`
  display: flex;
  align-items: center;
  line-height: 18px;
  padding: 10px 0;
`
