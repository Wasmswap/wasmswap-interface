import { styled } from '@stitches/react'
import { Text } from '../Text'
import { Button } from '../Button'
import { formatTokenBalance } from '../../util/conversion'
import React from 'react'

type TxToken = {
  tokenSymbol: string | undefined
  price: number | undefined
}

type TransactionTipsProps = {
  tokenA: TxToken
  tokenB: TxToken
}

export const TransactionAction = ({
  tokenA: { tokenSymbol: tokenASymbol, price: tokenAPrice },
  tokenB: { tokenSymbol: tokenBSymbol, price: tokenBPrice },
}: TransactionTipsProps) => {
  return (
    <StyledDivForWrapper>
      <StyledDivForInfo>
        <Text type="microscopic" variant="bold" color="disabled">
          RATE
        </Text>
        <Text type="microscopic" variant="bold" color="disabled">
          {Boolean(tokenASymbol && tokenBSymbol) && (
            <>
              {typeof tokenAPrice === 'number' &&
                typeof tokenBPrice === 'number' && (
                  <>
                    1 {tokenASymbol} ={' '}
                    {formatTokenBalance(tokenAPrice / tokenBPrice)}{' '}
                    {tokenBSymbol}
                  </>
                )}
            </>
          )}
        </Text>
      </StyledDivForInfo>
      <Button>
        <Text type="subtitle" color="white" variant="light" paddingY="3px">
          Swap tokens
        </Text>
      </Button>
    </StyledDivForWrapper>
  )
}

const StyledDivForWrapper = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 184px',
  columnGap: 12,
  alignItems: 'center',
  padding: '12px 0',
})

const StyledDivForInfo = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgba(25, 29, 32, 0.05)',
  padding: '16px 18px',
  textTransform: 'uppercase',
  borderRadius: 8,
})
