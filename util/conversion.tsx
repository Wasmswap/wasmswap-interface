export const protectAgainstNaN = (value: number) => (isNaN(value) ? 0 : value)

export function convertMicroDenomToDenom(
  value: number | string,
  decimals: number
): number {
  if (decimals === 0) return Number(value)

  return protectAgainstNaN(Number(value) / Math.pow(10, decimals))
}

export function convertDenomToMicroDenom(
  value: number | string,
  decimals: number
): number {
  if (decimals === 0) return Number(value)

  return protectAgainstNaN(
    parseInt(String(Number(value) * Math.pow(10, decimals)), 10)
  )
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

export const createBalanceFormatter = ({
  maximumFractionDigits = 6,
  ...options
}: Parameters<typeof Intl.NumberFormat>[1] = {}) => {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
    ...options,
  })

  return (value: number, asString?: boolean) => {
    const formattedValue = formatter.format(value)
    return asString ? formattedValue : Number(formattedValue.replace(/,/g, ''))
  }
}

const balanceFormatter = createBalanceFormatter()

export function formatTokenBalance(value: number | string, asString?: boolean) {
  return balanceFormatter(Number(value), asString)
}

export const dollarValueFormatterWithDecimals = createBalanceFormatter({
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

export const dollarValueFormatter = createBalanceFormatter({
  maximumFractionDigits: 2,
})
