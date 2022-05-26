import { dollarValueFormatter, formatTokenBalance } from 'junoblocks'

const formatWithOneDecimal = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

const oneMillion = 1000000
const hundredMillions = 100 * oneMillion

export const formatCompactNumber = (
  value: number,
  kind: 'tokenAmount' | 'dollarValue' = 'dollarValue'
) => {
  if (value > hundredMillions) {
    return `${Math.round(value / hundredMillions)}M`
  }
  if (value > oneMillion) {
    return `${formatWithOneDecimal.format(value / oneMillion)}M`
  }
  if (value > 10000) {
    return `${formatWithOneDecimal.format(Math.round(value / 1000))}K`
  }
  if (value > 1000) {
    return dollarValueFormatter(Math.round(value), {
      includeCommaSeparation: true,
    })
  }
  if (kind === 'dollarValue') {
    return dollarValueFormatter(value, {
      includeCommaSeparation: true,
    })
  }
  return formatTokenBalance(value)
}
