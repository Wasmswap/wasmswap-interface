import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'

import { useGetTokenDollarValueQuery } from './useGetTokenDollarValueQuery'

export type InternalQueryContext = {
  client: CosmWasmClient
  getTokenDollarValue: ReturnType<typeof useGetTokenDollarValueQuery>[0]
}
