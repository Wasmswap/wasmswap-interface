import { AssetCard, AssetCardState } from './AssetCard'
import { Text } from '../Text'
import { styled } from '@stitches/react'
import { walletState } from '../../state/atoms/walletAtoms'
import { useWalletConnectionStatus } from '../../hooks/useWalletConnectionStatus'
import { useGetSupportedAssetsBalancesOnChain } from './useGetSupportedAssetsBalancesOnChain'
import { __TRANSFERS_ENABLED__ } from '../../util/constants'

export const AssetsList = ({ onActionClick }) => {
  const [loadingBalances, [myTokens, allTokens]] =
    useGetSupportedAssetsBalancesOnChain()

  const { isConnecting, isConnected } = useWalletConnectionStatus(walletState)

  /* isLoading state is true if either we connect the wallet or loading balances */
  const isLoading = isConnecting || loadingBalances
  /* check if the user has any of the assets transferred on the chain */
  const hasTransferredAssets =
    isConnected && !loadingBalances && myTokens.length > 0

  return (
    <>
      {__TRANSFERS_ENABLED__ && (
        <StyledGrid>
          <Text variant="light" paddingBottom="19px">
            My tokens
          </Text>
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
                <Text
                  type="body"
                  variant="light"
                  color="secondaryText"
                  as="span"
                >
                  You don’t have any tokens. Might be time to deposit some in?
                </Text>
              )}
              {!isConnected && !isLoading && (
                <Text type="body" variant="light">
                  Connect your wallet{' '}
                  <Text
                    type="body"
                    variant="light"
                    color="secondaryText"
                    as="span"
                  >
                    to see your tokens.
                  </Text>
                </Text>
              )}
            </>
          )}
        </StyledGrid>
      )}

      <Text
        variant="light"
        paddingTop={!__TRANSFERS_ENABLED__ ? '0px' : '39px'}
        paddingBottom={!__TRANSFERS_ENABLED__ ? '12px' : '20px'}
      >
        All tokens
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
    </>
  )
}

const StyledGrid = styled('div', {
  display: 'grid',
  rowGap: '8px',
})
