import { styled, Text } from 'junoblocks'
import Link from 'next/link'

export const MigrationCard = () => {
  return (
    <StyledCard>
      <Text>
        Junoswap is migrating liquidity to WYND DEX. As part of this transition,
        most RAW pools have had swaps and deposits frozen. These pools will be
        automatically migrated upon the launch of WYND DEX. Users with liquidity
        in these pools may still withdraw funds if they do not want to be
        migrated. All other pools are trading as normal and most will also be
        automatically migrated. Please see RAW DAO prop 18 for the full details
        and list of pools eligible for automatic migration.{' '}
        <Link href="https://www.rawdao.zone/vote/18" passHref>
          <StyledA>More details</StyledA>
        </Link>
      </Text>
    </StyledCard>
  )
}

const StyledCard = styled('div', {
  padding: '$8',
  marginTop: '22px',
  backgroundColor: '$colors$dark10',
  borderRadius: '8px',
})

const StyledA = styled('a', {
  color: '$textColors$brand',
  '&:hover': {
    textDecoration: 'underline',
  },
})
