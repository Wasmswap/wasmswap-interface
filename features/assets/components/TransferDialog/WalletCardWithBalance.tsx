import { CardWithSeparator } from '../../../../components/CardWithSeparator'
import { Text } from '../../../../components/Text'
import { StyledHeader, StyledDivForBalance, WalletIcon } from './card.styles'
import { TransactionOrigin, TransactionType } from './types'

type WalletCardWithBalanceProps = {
  transactionType: TransactionType
  transactionOrigin: TransactionOrigin
  walletAddress: string
  balance: number
  tokenName: string
}

export const WalletCardWithBalance = ({
  transactionType,
  transactionOrigin,
  walletAddress = 'No address found',
  balance = 0,
  tokenName,
}: WalletCardWithBalanceProps) => {
  return (
    <CardWithSeparator
      paddingBottom={0}
      contents={[
        <>
          <Text type="microscopic" variant="light">
            {transactionType === 'incoming' ? 'TO' : 'FROM'}
          </Text>
          <StyledHeader>
            <WalletIcon transactionOrigin={transactionOrigin} />
            <div>
              <Text type="body" variant="light">
                {transactionOrigin === 'platform' ? 'Junoswap' : 'Keplr wallet'}
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
              {balance} {tokenName}
            </Text>
          </StyledDivForBalance>
        </>,
      ]}
    />
  )
}
