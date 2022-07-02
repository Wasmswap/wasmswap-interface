import { PoolEntityType, TokenInfo } from '../queries/usePoolsListQuery'

export const BASE_TOKEN: TokenInfo = {
  id: '',
  chain_id: 'lucina',
  token_address: '',
  symbol: 'WSWAP',
  name: 'Wasmswap',
  decimals: 6,
  logoURI: 'https://cryptologos.cc/logos/anyswap-any-logo.svg?v=022',
  tags: ['native'],
  native: true,
  denom: 'ujuno',
}

export const CRAB_TOKEN: TokenInfo = {
  id: '',
  chain_id: 'lucina',
  token_address:
    'juno14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9skjuwg8',
  symbol: 'CRAB',
  name: 'Crab',
  decimals: 6,
  logoURI: 'https://cryptologos.cc/logos/irisnet-iris-logo.svg?v=022',
  tags: ['memecoin'],
  native: false,
  denom: 'ucrab',
}

export const DAO_TOKEN: TokenInfo = {
  id: '',
  chain_id: 'lucina',
  token_address:
    'juno1yw4xvtc43me9scqfr2jr2gzvcxd3a9y4eq7gaukreugw2yd2f8ts9z8cq8',
  symbol: 'DAO',
  name: 'DAO',
  decimals: 6,
  logoURI: 'https://cryptologos.cc/logos/torn-torn-logo.svg?v=022',
  tags: ['memecoin'],
  native: false,
  denom: 'udao',
}

export const BASE_TOKEN_CRAB_POOL: PoolEntityType = {
  pool_id: 'WSWAP-CRAB',
  pool_assets: [BASE_TOKEN, CRAB_TOKEN],
  swap_address:
    'juno1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrq68ev2p',
  staking_address:
    'juno16y344e8ryydmeu2g8yyfznq79j7jfnar4p59ngpvaazcj83jzsmsnvh4g8',
  rewards_tokens: [],
}

export const BASE_TOKEN_DAO_POOL: PoolEntityType = {
  pool_id: 'WSWAP-DAO',
  pool_assets: [BASE_TOKEN, DAO_TOKEN],
  swap_address:
    'juno1hulx7cgvpfcvg83wk5h96sedqgn72n026w6nl47uht554xhvj9ns263mx9',
  staking_address:
    'juno1q23d30x94cm8ve243pxdc52m398r4l5ecgcfp8tud3vggcsq8s2qv7kt2z',
  rewards_tokens: [],
}

export const CRAB_DAO_POOL: PoolEntityType = {
  pool_id: 'CRAB-DAO',
  pool_assets: [CRAB_TOKEN, DAO_TOKEN],
  swap_address:
    'juno187zds75uenfxht2zqz7e0wxn3ushcawvf2ndrns6q63hgfn6ptqq7d7smp',
  staking_address: '',
  rewards_tokens: [],
}
