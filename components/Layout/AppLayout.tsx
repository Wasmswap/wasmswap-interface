import { styled } from '../theme'
import { NavigationSidebar } from './NavigationSidebar'
import { FooterBar } from './FooterBar'
import { APP_MAX_WIDTH } from 'util/constants'

export const AppLayout = ({
  navigationSidebar = <NavigationSidebar />,
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

      <StyledWrapperForSpring>
        <StyledSpringBottom src="/springs-bg.png" />
      </StyledWrapperForSpring>
    </StyledWrapper>
  )
}

const StyledWrapper = styled('div', {
  display: 'grid',
  minHeight: '100vh',
  gridTemplateColumns: '18rem 1fr',
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
    maxWidth: '53.75rem',
  },
})

const StyledWrapperForSpring = styled('div', {
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  position: 'fixed',
  width: '100%',
  maxWidth: APP_MAX_WIDTH,
  height: '100vh',
  zIndex: '$1',
})

const StyledSpringBottom = styled('img', {
  position: 'fixed',
  right: 0,
  bottom: 0,
  width: '35%',
  maxWidth: '500px',
  zIndex: '$1',
  userSelect: 'none',
  userDrag: 'none',
})
