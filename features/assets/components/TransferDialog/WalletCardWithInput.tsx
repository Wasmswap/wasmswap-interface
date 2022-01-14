import { CardWithSeparator } from '../../../../components/CardWithSeparator'
import { Text } from '../../../../components/Text'
import { StyledHeader, StyledDivForBalance, WalletIcon } from './card.styles'
import { TokenAmountInput } from '../../../../components/TokenAmountInput'
import { TransactionOrigin, TransactionType } from './types'
import { useIBCAssetInfo } from 'hooks/useIBCAssetInfo'

type WalletCardWithInputProps = {
  transactionType: TransactionType
  transactionOrigin: TransactionOrigin
  tokenSymbol: string
  value: number
  maxValue: number
  onChange: (value: number) => void
  walletAddress: string
}

export const WalletCardWithInput = ({
  transactionType,
  transactionOrigin,
  tokenSymbol,
  value,
  maxValue = 1000,
  onChange,
  walletAddress = 'No address found',
}: WalletCardWithInputProps) => {
  const tokenInfo = useIBCAssetInfo(tokenSymbol)
  // TODO: Configure max fee per chain
  const maxFee = 0.05
  return (
    <CardWithSeparator
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
          <StyledDivForBalance>
            <Text variant="caption">Max available: </Text>
            <Text variant="caption" color="brand" css={{ paddingLeft: '$1' }}>
              {maxValue} {tokenInfo.name}
            </Text>
          </StyledDivForBalance>
          <TokenAmountInput
            amount={value}
            onAmountChange={onChange}
            maxAmount={Math.max(maxValue - maxFee, 0)}
            tokenSymbol={tokenInfo.symbol}
          />
        </>,
      ]}
    />
  )
}
