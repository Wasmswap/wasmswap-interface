import { CardWithSeparator } from '../CardWithSeparator'
import { Text } from '../Text'
import { StyledHeader, StyledDivForBalance, WalletIcon } from './card.styles'
import { TokenAmountInput } from '../TokenAmountInput'
import { useTokenInfo } from '../../hooks/useTokenInfo'
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
  return (
    <CardWithSeparator
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
              {maxValue} {tokenInfo.name}
            </Text>
          </StyledDivForBalance>
          <TokenAmountInput
            value={value}
            onAmountChange={onChange}
            maxValue={maxValue}
            tokenSymbol={tokenInfo.symbol}
          />
        </>,
      ]}
    />
  )
}
