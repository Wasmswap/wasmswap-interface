import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { protectAgainstNaN } from 'junoblocks'

type QueryLiquidityBalanceArgs = {
  address: string
  tokenAddress: string
  client: CosmWasmClient
}

export const queryLiquidityBalance = async ({
  client,
  tokenAddress,
  address,
}: QueryLiquidityBalanceArgs) => {
  try {
    const query = await client.queryContractSmart(tokenAddress, {
      balance: { address },
    })

    return protectAgainstNaN(Number(query.balance))
  } catch (e) {
    console.error('Cannot get liquidity balance:', e)
  }
}
