import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'

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
  swapAddress: string
  outputSwapAddress: string
  client: CosmWasmClient
}

export const getTokenForTokenPrice = async ({
  tokenAmount,
  swapAddress,
  outputSwapAddress,
  client,
}: GetTokenForTokenPriceInput) => {
  try {
    const nativePrice = await getToken2ForToken1Price({
      tokenAmount,
      swapAddress,
      client,
    })

    return getToken1ForToken2Price({
      nativeAmount: nativePrice,
      swapAddress: outputSwapAddress,
      client: client,
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
