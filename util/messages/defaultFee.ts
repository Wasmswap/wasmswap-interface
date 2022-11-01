import { __DISABLE_GAS_AUTO__, GAS_PRICE } from '../constants'
import { GasPrice, calculateFee } from '@cosmjs/stargate'

export const DEFAULT_FEE = !__DISABLE_GAS_AUTO__ ? 'auto' : calculateFee(80_000,GasPrice.fromString(GAS_PRICE))
