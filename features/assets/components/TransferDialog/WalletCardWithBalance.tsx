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
          <Text variant="caption">
            {transactionType === 'incoming' ? 'TO' : 'FROM'}
          </Text>
          <StyledHeader>
            <WalletIcon transactionOrigin={transactionOrigin} />
            <div>
              <Text variant="body">
                {transactionOrigin === 'platform' ? 'Junoswap' : 'Keplr wallet'}
              </Text>
              <Text
                variant="caption"
                color="tertiary"
                css={{ paddingTop: '$1' }}
              >
                {walletAddress}
              </Text>
            </div>
          </StyledHeader>
        </>,
        <>
          <StyledDivForBalance $paddingY={18}>
            <Text variant="caption">Current balance: </Text>
            <Text variant="caption" color="primary" css={{ paddingLeft: '$1' }}>
              {balance} {tokenName}
            </Text>
          </StyledDivForBalance>
        </>,
      ]}
    />
  )
}
