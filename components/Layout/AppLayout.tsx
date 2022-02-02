import { styled } from '../theme'
import { NavigationSidebar } from './NavigationSidebar'
import { FooterBar } from './FooterBar'
import { APP_MAX_WIDTH } from 'util/constants'
import { ExtensionSidebar } from './ExtensionSidebar'

export const AppLayout = ({
  navigationSidebar = <NavigationSidebar />,
  extensionSidebar = <ExtensionSidebar />,
  footerBar = <FooterBar />,
  children,
}) => {
  return (
    <StyledWrapper>
      {navigationSidebar}

      <StyledContainer>
        <main>{children}</main>
        {footerBar}
      </StyledContainer>

      {extensionSidebar}
    </StyledWrapper>
  )
}

const StyledWrapper = styled('div', {
  display: 'grid',
  minHeight: '100vh',
  gridTemplateColumns: '18rem 1fr 18rem',
  backgroundColor: '$backgroundColors$base',
  maxWidth: APP_MAX_WIDTH,
  margin: '0 auto',
})

const StyledContainer = styled('div', {
  position: 'relative',
  zIndex: '$2',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '0 $12',
  '& main': {
    margin: '0 auto',
    width: '100%',
    maxWidth: '53.75rem',
  },
})
