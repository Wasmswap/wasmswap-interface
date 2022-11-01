export const DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL = 15000
export const DEFAULT_REFETCH_ON_WINDOW_FOCUS_STALE_TIME = 60000 // 1 minute
export const SLIPPAGE_OPTIONS = [0.01, 0.02, 0.03, 0.05]
export const NETWORK_FEE = 0.003
export const GAS_PRICE = process.env.NEXT_PUBLIC_GAS_PRICE

export const APP_NAME = process.env.NEXT_PUBLIC_SITE_TITLE
export const APP_MAX_WIDTH = '1920px'

export const MAIN_PANE_MAX_WIDTH = '880px'

export const POOL_TOKENS_DECIMALS = 6

/* the app operates in test mode */
export const __TEST_MODE__ = !JSON.parse(
  process.env.NEXT_PUBLIC_TEST_MODE_DISABLED
)

/* feature flags */
export const __POOL_STAKING_ENABLED__ = JSON.parse(
  process.env.NEXT_PUBLIC_ENABLE_FEATURE_STAKING
)
export const __POOL_REWARDS_ENABLED__ = JSON.parse(
  process.env.NEXT_PUBLIC_ENABLE_FEATURE_REWARDS
)
export const __TRANSFERS_ENABLED__ = JSON.parse(
  process.env.NEXT_PUBLIC_ENABLE_FEATURE_TRANSFERS
)
export const __DARK_MODE_ENABLED_BY_DEFAULT__ = JSON.parse(
  process.env.NEXT_PUBLIC_DARK_MODE_ENABLED_BY_DEFAULT
)
/* /feature flags */
