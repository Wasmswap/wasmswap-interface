import { AppLayout, PageHeader } from 'components'
import { PoolCreateModule } from '../../features/liquidity'

const PoolsCreate = () => {
  return (
    <AppLayout>
      <PageHeader title="Pool Creation" subtitle="" />
      <PoolCreateModule />
    </AppLayout>
  )
}

export default PoolsCreate
