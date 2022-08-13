import { SwapInfo } from '../../hooks/useSwapInfo'
import { POOL_TOKENS_DECIMALS } from '../constants'
import { convertMicroDenomToDenom } from './conversion'

type CalcPoolTokenValueArgs = {
  tokenAmountInMicroDenom: number
  tokenSupply: SwapInfo['lp_token_supply']
  tokenReserves: SwapInfo['token1_reserve'] | SwapInfo['token2_reserve']
}

export const calcPoolTokenValue = ({
  tokenAmountInMicroDenom,
  tokenSupply,
  tokenReserves,
}: CalcPoolTokenValueArgs) => {
  return convertMicroDenomToDenom(
    (tokenAmountInMicroDenom / tokenSupply) * tokenReserves,
    POOL_TOKENS_DECIMALS
  )
}

type CalcPoolTokenDollarValueArgs = {
  tokenAmountInMicroDenom: number
  tokenDollarPrice: number
  tokenSupply: SwapInfo['lp_token_supply']
  tokenReserves: SwapInfo['token1_reserve'] | SwapInfo['token2_reserve']
}

export const calcPoolTokenDollarValue = ({
  tokenAmountInMicroDenom,
  tokenSupply,
  tokenReserves,
  tokenDollarPrice,
}: CalcPoolTokenDollarValueArgs) => {
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
