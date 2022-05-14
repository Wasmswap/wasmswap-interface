import { useWalletConnectionStatus } from 'hooks/useWalletConnectionStatus'
import { styled, Text, useDelayedAppearanceFlag } from 'junoblocks'
import { walletState } from 'state/atoms/walletAtoms'
import { __TRANSFERS_ENABLED__ } from 'util/constants'

import { useGetSupportedAssetsBalancesOnChain } from '../hooks/useGetSupportedAssetsBalancesOnChain'
import { AssetCard, AssetCardState } from './AssetCard'

export const AssetsList = ({ onActionClick }) => {
  const [loadingBalances, [myTokens, allTokens]] =
    useGetSupportedAssetsBalancesOnChain()

  const { isConnecting, isConnected } = useWalletConnectionStatus(walletState)

  /* isLoading state is true if either we connect the wallet or loading balances */
  const isLoading = isConnecting || loadingBalances
  /* check if the user has any of the assets transferred on the chain */
  const hasTransferredAssets =
    isConnected && !loadingBalances && myTokens.length > 0

  const isLoadingStateShowing = useDelayedAppearanceFlag(isLoading, 650)

  /* don't show the fetching state just yet */
  if (isLoading && !isLoadingStateShowing) {
    return null
  }

  return (
    <>
      {__TRANSFERS_ENABLED__ && (
        <>
          <Text variant="primary" css={{ paddingBottom: '$12' }}>
            My assets
          </Text>
          <StyledGrid>
            {isLoading ? (
              <AssetCard state={AssetCardState.fetching} />
            ) : (
              <>
                {hasTransferredAssets &&
                  myTokens.map(({ tokenSymbol, balance }) => (
                    <AssetCard
                      state={AssetCardState.active}
                      key={tokenSymbol}
                      tokenSymbol={tokenSymbol}
                      onActionClick={onActionClick}
                      balance={balance}
                    />
                  ))}
                {isConnected && !hasTransferredAssets && (
                  <Text variant="body" as="span">
                    No IBC assets... yet!
                  </Text>
                )}
                {!isConnected && !isLoading && (
                  <Text variant="body">
                    Connect your wallet{' '}
                    <Text variant="body" as="span">
                      to see your tokens.
                    </Text>
                  </Text>
                )}
              </>
            )}
          </StyledGrid>
        </>
      )}

      <Text
        variant="primary"
        css={{
          paddingTop: !__TRANSFERS_ENABLED__ ? '0' : '$16',
          paddingBottom: !__TRANSFERS_ENABLED__ ? '$6' : '$12',
        }}
      >
        {__TRANSFERS_ENABLED__ ? 'Other tokens' : 'Soon available to transfer'}
      </Text>
      <StyledGrid>
        {__TRANSFERS_ENABLED__ && isLoading ? (
          <>
            {new Array(3).fill(0).map((__, index) => (
              <AssetCard
                key={index}
                style={{ opacity: 1 - (index > 0 ? 0.2 + index * 0.2 : 0) }}
                state={AssetCardState.fetching}
              />
            ))}
          </>
        ) : (
          <>
            {allTokens?.map(({ tokenSymbol, balance }) => (
              <AssetCard
                key={tokenSymbol}
                tokenSymbol={tokenSymbol}
                onActionClick={onActionClick}
                balance={balance}
              />
            ))}
          </>
        )}
      </StyledGrid>
      <Text
        variant="caption"
        align="center"
        color="disabled"
        css={{
          padding: '$16 0',
          borderBottom: '1px solid $borderColors$inactive',
        }}
      >
        More tokens available soon
      </Text>
    </>
  )
}

const StyledGrid = styled('div', {
  display: 'grid',
  rowGap: '$space$4',
})
