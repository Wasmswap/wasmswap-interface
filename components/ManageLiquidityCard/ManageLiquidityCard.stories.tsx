import { ManageLiquidityCard } from '.'

export default {
  title: 'Components/ManageLiquidityCard',
  component: ManageLiquidityCard,
}

const Template = (args) => <ManageLiquidityCard {...args} />

const tokenAInfo = {
  id: 'juno-network',
  chain_id: 'juno-1',
  token_address: '',
  symbol: 'JUNO',
  name: 'Juno',
  decimals: 6,
  logoURI:
    'https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png',
  tags: ['native'],
  native: true,
  denom: 'ujuno',
}
const tokenBInfo = {
  id: 'usdc',
  chain_id: 'juno-1',
  token_address: '',
  symbol: 'USDC',
  name: 'USDC',
  decimals: 6,
  logoURI:
    'https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/axlusdc.png',
  tags: ['native'],
  native: true,
  denom: 'ibc/EAC38D55372F38F1AFD68DF7FE9EF762DCF69F26520643CF3F9D292A738D8034',
}

export const Default = Template.bind({})
Default.args = {
  liquidityDollarValue: 320.3,
  availableToBondDollarValue: 240,
  supportsIncentives: true,
  tokenAInfo,
  tokenBInfo,
  tokenAReserve: 10,
  tokenBReserve: 50,
}
