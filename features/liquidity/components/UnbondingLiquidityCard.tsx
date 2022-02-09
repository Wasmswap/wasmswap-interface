import dayjs from 'dayjs'
import { useQuery } from 'react-query'
import { Card, CardContent } from 'components/Card'
import { Inline } from 'components/Inline'
import { Text } from 'components/Text'
import { ImageForTokenLogo } from 'components/ImageForTokenLogo'
import { ErrorIcon } from 'icons/Error'
import { TokenInfo } from 'hooks/useTokenList'
import {
  useGetPoolTokensDollarValue,
  usePoolPairTokenAmount,
} from 'hooks/useStakedToken'
import {
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
} from 'util/conversion'
import { maybePluralize } from 'util/maybePluralize'

type UnbondingLiquidityCardProps = {
  poolId: string
  tokenA: Pick<TokenInfo, 'symbol' | 'logoURI'>
  tokenB: Pick<TokenInfo, 'symbol' | 'logoURI'>
  size?: 'large' | 'small'
  releaseAt: number
  amount: number
}

const testDate = dayjs().add(10, 'minutes')

export const UnbondingLiquidityCard = ({
  tokenA,
  tokenB,
  size = 'large',
  releaseAt,
  amount,
  poolId,
}: UnbondingLiquidityCardProps) => {
  const [dollarValue] = useGetPoolTokensDollarValue({
    poolId,
    tokenAmountInMicroDenom: amount,
  })

  const formattedDollarValue =
    typeof dollarValue === 'number' &&
    dollarValueFormatterWithDecimals(dollarValue, {
      includeCommaSeparation: true,
    })

  const [tokenAAmount] = usePoolPairTokenAmount({
    poolId,
    tokenAmountInMicroDenom: amount / 2,
    tokenPairIndex: 0,
  })

  const tokenAFormattedAmount = `${formatTokenBalance(tokenAAmount, {
    includeCommaSeparation: true,
  })} ${tokenA.symbol}`

  const [tokenBAmount] = usePoolPairTokenAmount({
    poolId,
    tokenAmountInMicroDenom: amount / 2,
    tokenPairIndex: 1,
  })

  const tokenBFormattedAmount = `${formatTokenBalance(tokenBAmount, {
    includeCommaSeparation: true,
  })} ${tokenB.symbol}`

  const timeLeftLabel = useRelativeTimestamp({
    /* sort out the dates situation */
    timestamp: testDate || dayjs(releaseAt),
  })

  if (size === 'small') {
    return (
      <Card>
        <CardContent size="medium">
          <Inline css={{ padding: '$4 0' }} gap={4}>
            <ErrorIcon />
            <Text variant="legend">{timeLeftLabel}</Text>
          </Inline>
          <Inline justifyContent="space-between" css={{ paddingBottom: '$10' }}>
            <Inline gap={12}>
              <Inline gap={3}>
                <ImageForTokenLogo
                  size="medium"
                  logoURI={tokenA.logoURI}
                  alt={tokenA.symbol}
                />
                <Text variant="link">
                  {tokenAFormattedAmount} {tokenA.symbol}
                </Text>
              </Inline>
              <Inline gap={3}>
                <ImageForTokenLogo
                  size="medium"
                  logoURI={tokenB.logoURI}
                  alt={tokenB.symbol}
                />
                <Text variant="link">
                  {tokenBFormattedAmount} {tokenB.symbol}
                </Text>
              </Inline>
            </Inline>
            <Text variant="link">${formattedDollarValue}</Text>
          </Inline>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card>
      <CardContent>
        <Inline justifyContent="space-between" css={{ padding: '$11 0' }}>
          <Inline gap={16}>
            <Text variant="link">${formattedDollarValue}</Text>
            <Inline gap={12}>
              <Inline gap={3}>
                <ImageForTokenLogo
                  logoURI={tokenA.logoURI}
                  alt={tokenA.symbol}
                />
                <Text variant="link">{tokenAFormattedAmount}</Text>
              </Inline>
              <Inline gap={3}>
                <ImageForTokenLogo
                  logoURI={tokenB.logoURI}
                  alt={tokenB.symbol}
                />
                <Text variant="link">{tokenBFormattedAmount}</Text>
              </Inline>
            </Inline>
          </Inline>
          <Inline>
            <Text variant="legend">{timeLeftLabel}</Text>
          </Inline>
        </Inline>
      </CardContent>
    </Card>
  )
}

const useRelativeTimestamp = ({ timestamp }) => {
  return useQuery(
    `time/${timestamp}`,
    () => {
      /* parse the actual dates */
      const date = dayjs(timestamp)
      const now = dayjs()

      console.log(timestamp.toString())

      const hoursLeft = date.diff(now, 'hours')

      /* more than a day */
      if (hoursLeft > 24) {
        const daysLeft = date.diff(now, 'days')
        const hoursLeftAfterDays = Math.round(24 * ((hoursLeft / 24) % 1.0))

        return `${
          hoursLeftAfterDays > 0
            ? `${maybePluralize(hoursLeftAfterDays, 'hour')} / `
            : ''
        } ${maybePluralize(daysLeft, 'day')}`
      }

      /* less than 24 hours left but not less than an hour */
      if (hoursLeft < 24 && hoursLeft > 1) {
        return maybePluralize(hoursLeft, 'hour')
      }

      const minsLeft = date.diff(now, 'minutes')

      if (minsLeft > 0) {
        /* less than an hour */
        return maybePluralize(minsLeft, 'minute')
      }

      return 'now'
    },
    {
      refetchIntervalInBackground: true,
      refetchInterval: 5000,
    }
  ).data
}
