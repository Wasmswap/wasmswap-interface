import { styled, Text } from 'junoblocks'
import Link from 'next/link'

export const MigrationCard = () => {
  return (
    <StyledCard>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.{' '}
        <Link href="https://www.junonetwork.io/" passHref>
          <a>Link</a>
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
