import { CardWithSeparator } from '../CardWithSeparator'
import { Text } from '../Text'
import {
  StyledHeader,
  StyledDivForBalance,
  StyledIconWrapper,
} from './card.styles'
import { AppLogoIcon } from '../AppLogoIcon'

export const WalletCardWithBalance = ({}) => {
  return (
    <CardWithSeparator
      paddingBottom={0}
      contents={[
        <>
          <Text type="microscopic" variant="light">
            TO
          </Text>
          <StyledHeader>
            <StyledIconWrapper
              size="44px"
              color="#1a44af"
              rounded
              enableGradient
              icon={<AppLogoIcon />}
            />
            <div>
              <Text type="body" variant="light">
                Junoswap
              </Text>
              <Text
                type="microscopic"
                variant="normal"
                color="gray"
                paddingTop="2"
              >
                juno1uw6ls6y8du6d1uw6ls6y8du6d1uw6ls6y
              </Text>
            </div>
          </StyledHeader>
        </>,
        <>
          <StyledDivForBalance $paddingY={18}>
            <Text type="microscopic" variant="light">
              Current balance:{' '}
            </Text>
            <Text
              type="microscopic"
              variant="normal"
              color="black"
              paddingLeft="2"
            >
              133 JUNO
            </Text>
          </StyledDivForBalance>
        </>,
      ]}
    />
  )
}
