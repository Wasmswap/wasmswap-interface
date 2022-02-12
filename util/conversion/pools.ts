import { convertMicroDenomToDenom } from './conversion'
import { POOL_TOKENS_DECIMALS } from '../constants'

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
