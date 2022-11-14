import { TokenSelector } from '../../swap/components/TokenSelector'
// import { useTokenToTokenPrice } from '../../``swap/hooks/useTokenToTokenPrice'
import { useTokenDollarValue } from '../../../hooks/useTokenDollarValue'
import { Row } from 'components'
import {
  Text,
  styled,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDivider,
  DialogButtons,
  Button,
  Spinner,
} from 'junoblocks'
import { useState } from 'react'

export const PoolCreateModule = () => {
  const [token1, setToken1] = useState({
    tokenSymbol: 'RAW',
    amount: 0,
  })
  const [token2, setToken2] = useState({
    tokenSymbol: '',
    amount: 0,
  })
  const onChangeToken1 = (event) => {
    setToken1(event)
  }
  const onChangeToken2 = (event) => {
    setToken2(event)
  }

  //   const [{ price: currentTokenPrice }, isPriceLoading] = useTokenToTokenPrice({
  //   tokenASymbol: token1.tokenSymbol,
  //   tokenBSymbol: tokenBSymbol,
  //   tokenAmount: 1,
  // })

  const [tokenAPrice, isPriceALoading] = useTokenDollarValue(token1.tokenSymbol)

  console.log('tokenAPrice', tokenAPrice, isPriceALoading)

  const [tokenBPrice, isPriceBLoading] = useTokenDollarValue(token2.tokenSymbol)

  console.log('tokenBPrice', tokenBPrice, isPriceBLoading)

  return (
    <>
      <AddLiquidityDialog
        token1={token1}
        token2={token2}
        onChangeToken1={onChangeToken1}
        onChangeToken2={onChangeToken2}
        token1Price={tokenAPrice}
        token2Price={(token1.amount * tokenAPrice) / token2.amount}
      />
    </>
  )
}

const TokenPicker = ({ onClick }) => {
  return (
    <TokenPickerWrapper onClick={onClick}>
      <TokenPickerIconPlaceholder />
      <Text variant="hero">Token</Text>
      <Text style={{ marginTop: '60px' }}>Pick a token +</Text>
    </TokenPickerWrapper>
  )
}

const TokenPickerWrapper = styled('div', {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  backgroundColor: '$backgroundColors$primary',
  borderRadius: '6px',
})

const TokenPickerIconPlaceholder = styled('div', {
  border: '1px solid #ccc',
  backgroundColor: '#ccc',
  width: 50,
  height: 50,
  borderRadius: '50%',
  marginBottom: '20px',
})

const AddLiquidityDialog = ({
  token1,
  token1Price = 0,
  token2,
  token2Price = 0,
  onChangeToken1,
  onChangeToken2,
}) => {
  return (
    <Row style={{ gap: '4px', alignItems: 'flex-start' }}>
      <TokenPickerWrapper onClick={() => console.log('click')}>
        <TokenSelector
          tokenSymbol={token1.tokenSymbol}
          amount={token1.amount}
          onChange={onChangeToken1}
          size="small"
          containerCss={{
            padding: 0,
            width: '100%',
          }}
        />

        <div>
          1 {token1.tokenSymbol} =~ {token1.amount / token2.amount}{' '}
          {token2.tokenSymbol} =~ ${token1Price}
        </div>
      </TokenPickerWrapper>
      <TokenPickerWrapper onClick={() => console.log('click')}>
        <TokenSelector
          tokenSymbol={token2.tokenSymbol}
          amount={token2.amount}
          onChange={onChangeToken2}
          size="small"
          containerCss={{
            padding: 0,
            width: '100%',
          }}
        />

        <div>
          1 {token2.tokenSymbol} =~ {token2.amount / token1.amount}{' '}
          {token1.tokenSymbol} =~ ${token2Price}
        </div>
      </TokenPickerWrapper>
    </Row>
  )
}

const StyledDivForWrapper = styled('div', {
  borderRadius: '8px',
  // backgroundColor: '$colors$dark10',
})
