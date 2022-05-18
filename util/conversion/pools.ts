import { POOL_TOKENS_DECIMALS } from '../constants'
import { convertMicroDenomToDenom } from './conversion'

export const calcPoolTokenValue = ({
  tokenAmountInMicroDenom,
  tokenSupply,
  tokenReserves,
}) => {
  return convertMicroDenomToDenom(
    (tokenAmountInMicroDenom / tokenSupply) * tokenReserves,
    POOL_TOKENS_DECIMALS
  )
}

export const calcPoolTokenDollarValue = ({
  tokenAmountInMicroDenom,
  tokenSupply,
  tokenReserves,
  tokenDollarPrice,
}) => {
  return (
    calcPoolTokenValue({
      tokenAmountInMicroDenom,
      tokenSupply,
      tokenReserves,
    }) *
    tokenDollarPrice *
    2
  )
}
