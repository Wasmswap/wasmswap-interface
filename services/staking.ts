import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { defaultExecuteFee } from "util/fees";

export const stakeTokens = async (senderAddress:string, tokenAddress: string, amount: number, client: SigningCosmWasmClient) => {
    let msg = {"stake":{"amount":amount.toString()}} 
    return client.execute(senderAddress,tokenAddress,msg,defaultExecuteFee,undefined,[])
}

export const unstakeTokens = async (senderAddress:string, tokenAddress: string, amount: number, client: SigningCosmWasmClient) => {
    let msg = {"unstake":{"amount":amount.toString()}} 
    return client.execute(senderAddress,tokenAddress,msg,defaultExecuteFee,undefined,[])
}

export const claim = async (senderAddress:string, tokenAddress: string, client: SigningCosmWasmClient) => {
    let msg = {"claim":{}} 
    return client.execute(senderAddress,tokenAddress,msg,defaultExecuteFee,undefined,[])
}