import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { PoolEntityType, TokenInfo } from '../../queries/usePoolsListQuery'

export interface GetToken1ForToken2PriceInput {
  nativeAmount: number
  swapAddress: string
  client: CosmWasmClient
}

export const getToken1ForToken2Price = async ({
  nativeAmount,
  swapAddress,
  client,
}: GetToken1ForToken2PriceInput) => {
  try {
    const response = await client.queryContractSmart(swapAddress, {
      token1_for_token2_price: {
        token1_amount: `${nativeAmount}`,
      },
    })
    return response.token2_amount
  } catch (e) {
    console.error('err(getToken1ForToken2Price):', e)
  }
}

export interface GetToken2ForToken1PriceInput {
  tokenAmount: number
  swapAddress: string
  client: CosmWasmClient
}

export const getToken2ForToken1Price = async ({
  tokenAmount,
  swapAddress,
  client,
}: GetToken2ForToken1PriceInput) => {
  try {
    const query = await client.queryContractSmart(swapAddress, {
      token2_for_token1_price: {
        token2_amount: `${tokenAmount}`,
      },
    })
    return query.token1_amount
  } catch (e) {
    console.error('error(getToken2ForToken1Price):', e)
  }
}

export interface GetTokenForTokenPriceInput {
  tokenAmount: number
  tokenA: TokenInfo
  tokenB: TokenInfo
  inputPool: PoolEntityType
  outputPool: PoolEntityType
  client: CosmWasmClient
}

export const getTokenForTokenPrice = async ({
  tokenAmount,
  tokenA,
  tokenB,
  inputPool,
  outputPool,
  client,
}: GetTokenForTokenPriceInput) => {
  try {
    const intermediatePrice =
      tokenA.symbol === inputPool.pool_assets[0].symbol
        ? await getToken1ForToken2Price({
            nativeAmount: tokenAmount,
            swapAddress: inputPool.swap_address,
            client,
          })
        : await getToken2ForToken1Price({
            tokenAmount,
            swapAddress: inputPool.swap_address,
            client,
          })

    return tokenB.symbol === outputPool.pool_assets[1].symbol
      ? await getToken1ForToken2Price({
          nativeAmount: intermediatePrice,
          swapAddress: outputPool.swap_address,
          client,
        })
      : await getToken2ForToken1Price({
          tokenAmount: intermediatePrice,
          swapAddress: outputPool.swap_address,
          client,
        })
  } catch (e) {
    console.error('error(getTokenForTokenPrice)', e)
  }
}
export type InfoResponse = {
  lp_token_supply: string
  lp_token_address: string
  token1_denom: string
  token1_reserve: string
  token2_denom: string
  token2_reserve: string
  owner?: string
  lp_fee_percent?: string
  protocol_fee_percent?: string
  protocol_fee_recipient?: string
}

export const getSwapInfo = async (
  swapAddress: string,
  client: CosmWasmClient
): Promise<InfoResponse> => {
  try {
    if (!swapAddress || !client) {
      throw new Error(
        `No swapAddress or rpcEndpoint was provided: ${JSON.stringify({
          swapAddress,
          client,
        })}`
      )
    }

    return await client.queryContractSmart(swapAddress, {
      info: {},
    })
  } catch (e) {
    console.error('Cannot get swap info:', e)
  }
}
