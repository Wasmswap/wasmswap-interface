export function convertMicroDenomToDenom(value: number | string) {
  const amount = Number(value) / 1000000
  return isNaN(amount) ? 0 : amount
}

export function convertDenomToMicroDenom(value: number | string): string {
  const amount = Number(value) * 1000000
  return String(isNaN(amount) ? 0 : amount)
}

export function convertFromMicroDenom(denom: string) {
  return denom?.substring(1).toUpperCase()
}

export function convertToFixedDecimals(value: number | string): string {
  const amount = Number(value)
  return amount > 0.01 ? amount.toFixed(2) : String(amount)
}

export const zeroVotingCoin = {
  amount: '0',
  denom: 'ucredits',
}

export const zeroStakingCoin = {
  amount: '0',
  denom: process.env.NEXT_PUBLIC_STAKING_DENOM || 'ustars',
}

export const formatTokenName = (name: string) => {
  if (name) {
    return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase()
  }
  return ''
}
