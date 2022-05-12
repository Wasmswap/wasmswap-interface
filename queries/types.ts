import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'

import { useGetPoolTokensDollarValue } from '../features/liquidity'
import { useGetTokenDollarValueQuery } from './useGetTokenDollarValueQuery'

export type InternalQueryContext = {
  client: CosmWasmClient
  getTokenDollarValue: ReturnType<typeof useGetTokenDollarValueQuery>[0]
  getPoolTokensDollarValue: ReturnType<typeof useGetPoolTokensDollarValue>[0]
}
