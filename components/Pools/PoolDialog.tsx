import styled from 'styled-components'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil'
import { PlusIcon } from '@heroicons/react/solid'
import { useQuery, useMutation } from 'react-query'
import { Dialog, DialogBody } from '../Dialog'
import { Text } from '../Text'
import { LiquidityInput } from '../LiquidityInput'
import { Link } from '../Link'
import { Button } from '../Button'
import {
  convertDenomToMicroDenom,
  convertMicroDenomToDenom,
  formatTokenName,
} from 'util/conversion'
import { walletState } from 'state/atoms/walletAtoms'
import { useEffect, useState } from 'react'
import { getSwapInfo } from 'services/swap'
import { addLiquidity, removeLiquidity } from 'services/liquidity'
import { Spinner } from '../Spinner'
import { useTokenBalance } from '../../hooks/useTokenBalance'
import { usePoolLiquidity } from '../../hooks/usePoolLiquidity'
import { colorTokens } from '../../util/constants'
import { RemoveLiquidityInput } from '../RemoveLiquidityInput'
import { useRefetchQueries } from '../../hooks/useRefetchQueries'
import { getBaseToken } from 'hooks/useTokenInfo'
import { useTokenToTokenPrice } from '../TokenSwap/hooks/useTokenToTokenPrice'

const balanceFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
})

export const PoolDialog = ({ isShowing, onRequestClose, tokenInfo }) => {
  const { address, client } = useRecoilValue(walletState)

  const baseTokenSymbol = getBaseToken().symbol

  const { balance: junoBalance } = useTokenBalance(baseTokenSymbol)
  const { balance: tokenBalance } = useTokenBalance(tokenInfo.symbol)

  const [liquidity] = usePoolLiquidity({
    poolIds: [tokenInfo.pool_id],
  })

  const { myLiquidity, myReserve } = liquidity?.[0] ?? {}

  const { data: { token2_reserve, token1_reserve, lp_token_address } = {} } =
    useQuery(
      `swapInfo/${tokenInfo.swap_address}`,
      async () => {
        return await getSwapInfo(
          tokenInfo.swap_address,
          process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT
        )
      },
      {
        enabled: Boolean(tokenInfo.swap_address),
      }
    )

  const {
    isLoading,
    reset: resetAddLiquidityMutation,
    mutate: mutateAddLiquidity,
    isSuccess,
  } = useMutation(
    async () => {
      if (isAddingLiquidity) {
        return await addLiquidity({
          nativeAmount: Math.floor(
            convertDenomToMicroDenom(tokenAAmount, getBaseToken().decimals)
          ),
          nativeDenom: getBaseToken().denom,
          maxToken: Math.floor(
            convertDenomToMicroDenom(tokenBAmount, tokenInfo.decimals) + 5
          ),
          minLiquidity: 0,
          swapAddress: tokenInfo.swap_address,
          senderAddress: address,
          tokenAddress: tokenInfo.token_address,
          tokenDenom: tokenInfo.denom,
          tokenNative: tokenInfo.native,
          client,
        })
      } else {
        return await removeLiquidity({
          amount: Math.floor(
            (removeLiquidityPercent / 100) * myLiquidity.coins
          ),
          minToken1: 0,
          minToken2: 0,
          swapAddress: tokenInfo.swap_address,
          senderAddress: address,
          lpTokenAddress: lp_token_address,
          client,
        })
      }
    },
    {
      onSuccess() {
        // show toast
        toast.success(`🎉 ${isAddingLiquidity ? 'Add' : 'Remove'} Successful`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })

        // close modal
        requestAnimationFrame(onRequestClose)
      },
      onError(error) {
        console.error(error)
        toast.error(
          `Couldn't ${
            isAddingLiquidity ? 'Add' : 'Remove'
          } liquidity because of: ${error}`,
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        )
      },
    }
  )

  const refetchQueries = useRefetchQueries()
  useEffect(() => {
    // refetch queries if the mutation succeeded & the dialog is closed
    const shouldRefetchQueries = isSuccess && !isShowing
    if (shouldRefetchQueries) {
      refetchQueries()
      setTimeout(resetAddLiquidityMutation, 350)
    }
  }, [isSuccess, refetchQueries, resetAddLiquidityMutation, isShowing])

  const [tokenAAmount, setTokenAAmount] = useState(1)
  const [tokenBAmount, setTokenBAmount] = useState(1)

  const [tokenPrice] = useTokenToTokenPrice({
    tokenASymbol: baseTokenSymbol,
    tokenBSymbol: tokenInfo.symbol,
    tokenAmount: 1,
  })

  const hasMoreBaseTokenValue = junoBalance * tokenPrice > tokenBalance

  const maxApplicableBalanceForBaseToken = hasMoreBaseTokenValue
    ? junoBalance - (junoBalance - tokenBalance / tokenPrice)
    : junoBalance

  const maxApplicableBalanceForToken = hasMoreBaseTokenValue
    ? tokenBalance
    : tokenBalance - (tokenBalance - junoBalance * tokenPrice)

  const handleTokenAAmountChange = (input: number) => {
    const value =
      input > maxApplicableBalanceForBaseToken
        ? maxApplicableBalanceForBaseToken
        : input
    setTokenAAmount(value)
    setTokenBAmount((Number(token2_reserve) / Number(token1_reserve)) * value)
  }

  const handleTokenBAmountChange = (input: number) => {
    const value =
      input > maxApplicableBalanceForToken
        ? maxApplicableBalanceForToken
        : input
    setTokenBAmount(value)
    setTokenAAmount((Number(token1_reserve) / Number(token2_reserve)) * value)
  }

  const handleApplyMaximumAmount = () => {
    handleTokenAAmountChange(maxApplicableBalanceForBaseToken)
  }

  const [isAddingLiquidity, setAddingLiquidity] = useState(true)
  const [removeLiquidityPercent, setRemoveLiquidityPercent] = useState(0)

  const submitButtonText = isAddingLiquidity
    ? 'Add Liquidity'
    : 'Remove Liquidity'

  return (
    <Dialog isShowing={isShowing} onRequestClose={onRequestClose}>
      <DialogBody>
        {typeof myReserve?.[0] === 'number' && (
          <StyledDivForButtons>
            <StyledSwitchButton
              onClick={() => setAddingLiquidity(true)}
              $active={isAddingLiquidity}
            >
              Add
            </StyledSwitchButton>
            <StyledSwitchButton
              onClick={() => setAddingLiquidity(false)}
              $active={!isAddingLiquidity}
            >
              Remove
            </StyledSwitchButton>
          </StyledDivForButtons>
        )}

        <StyledTitle
          $hasSubtitle={!isAddingLiquidity}
          type="title"
          variant="normal"
        >
          {isAddingLiquidity ? 'Add' : 'Remove'}{' '}
          {`Juno / ${formatTokenName(tokenInfo.symbol)}`}
        </StyledTitle>

        {!isAddingLiquidity && (
          <StyledSubtitle variant="light">
            Choose a percentage of your liquidity to remove
          </StyledSubtitle>
        )}

        {isAddingLiquidity && (
          <>
            <LiquidityInput
              tokenName={formatTokenName(baseTokenSymbol)}
              balance={junoBalance ? junoBalance : 0}
              amount={tokenAAmount}
              ratio={50}
              onAmountChange={handleTokenAAmountChange}
            />
            <LiquidityInput
              tokenName={formatTokenName(tokenInfo.symbol)}
              balance={tokenBalance ? tokenBalance : 0}
              amount={tokenBAmount}
              ratio={50}
              onAmountChange={handleTokenBAmountChange}
            />
          </>
        )}

        {!isAddingLiquidity && (
          <RemoveLiquidityInput
            value={removeLiquidityPercent}
            onChangeValue={setRemoveLiquidityPercent}
          />
        )}

        {isAddingLiquidity && (
          <StyledDivForLink>
            <StyledPlusIcon />
            <Link
              color="black"
              variant="normal"
              type="body"
              onClick={handleApplyMaximumAmount}
            >
              Add maximum amounts
            </Link>
          </StyledDivForLink>
        )}

        {!isAddingLiquidity && (
          <StyledDivForLiquiditySummary>
            <Text>
              {baseTokenSymbol}:{' '}
              {balanceFormatter.format(
                convertMicroDenomToDenom(
                  myReserve[0],
                  getBaseToken().decimals
                ) *
                  (removeLiquidityPercent / 100)
              )}
            </Text>
            <Text>
              {tokenInfo.symbol}:{' '}
              {balanceFormatter.format(
                convertMicroDenomToDenom(myReserve[1], tokenInfo.decimals) *
                  (removeLiquidityPercent / 100)
              )}
            </Text>
          </StyledDivForLiquiditySummary>
        )}

        <StyledButton
          size="humongous"
          onClick={isLoading ? undefined : mutateAddLiquidity}
          disabled={isLoading}
        >
          {isLoading ? <Spinner instant /> : submitButtonText}
        </StyledButton>
      </DialogBody>
    </Dialog>
  )
}

const StyledTitle = styled(Text)<{ $hasSubtitle: boolean }>`
  padding: ${(p) => (p.$hasSubtitle ? '18px 14px 8px' : '18px 14px')};
`

const StyledSubtitle = styled(Text)`
  padding: 0 14px 42px;
`

const StyledButton = styled(Button)`
  margin: 8px 0 14px;
`

const StyledPlusIcon = styled(PlusIcon)`
  color: ${colorTokens.black};
  width: 24px;
  height: 24px;
  margin-right: 8px;
`

const StyledDivForLink = styled.div`
  padding: 24px 14px;
  display: flex;
  align-items: center;
`

const StyledDivForButtons = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 14px;
`

const StyledSwitchButton = styled(Button).attrs(
  ({ $active, children, ...attrs }) => ({
    ...attrs,
    variant: 'rounded',
    color: $active ? 'black' : 'white',
    children: (
      <Text color={$active ? 'white' : 'black'} type="subtitle" variant="light">
        {children}
      </Text>
    ),
  })
)`
  min-width: 88px;
  margin-right: 4px;
`

const StyledDivForLiquiditySummary = styled.div`
  padding: 12px 14px 16px;
  text-transform: uppercase;
  p + p {
    padding-top: 12px;
  }
`
