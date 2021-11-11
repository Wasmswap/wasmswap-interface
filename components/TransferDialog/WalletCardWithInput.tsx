import { CardWithSeparator } from '../CardWithSeparator'
import { Text } from '../Text'
import { CreditCardIcon } from '@heroicons/react/solid'
import {
  StyledHeader,
  StyledDivForBalance,
  StyledIconWrapper,
} from './card.styles'
import { TokenAmountInput } from '../TokenAmountInput'

export const WalletCardWithInput = ({
  tokenName,
  value,
  maxValue = 1000,
  onChange,
  walletAddress = 'No address found',
}) => {
  return (
    <CardWithSeparator
      contents={[
        <>
          <Text type="microscopic" variant="light">
            FROM
          </Text>
          <StyledHeader>
            <StyledIconWrapper
              size="44px"
              color="#1a44af"
              rounded
              $enableGradient
              $enablePadding
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
                {walletAddress}
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
              {maxValue} {tokenName}
            </Text>
          </StyledDivForBalance>
          <TokenAmountInput
            value={value}
            onAmountChange={onChange}
            maxValue={maxValue}
          />
        </>,
      ]}
    />
  )
}
