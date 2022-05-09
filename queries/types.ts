import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'

import { useGetPoolTokensDollarValue } from '../features/liquidity'
import { useGetTokenDollarValue } from './useQueryPools'

export type InternalQueryContext = {
  client: CosmWasmClient
  getTokenDollarValue: ReturnType<typeof useGetTokenDollarValue>[0]
  getPoolTokensDollarValue: ReturnType<typeof useGetPoolTokensDollarValue>[0]
}
