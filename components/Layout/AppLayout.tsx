import { styled } from '../theme'
import { NavigationSidebar } from './NavigationSidebar'
import { FooterBar } from './FooterBar'

export const AppLayout = ({
  navigationSidebar = <NavigationSidebar />,
  footerBar = <FooterBar />,
  children,
}) => {
  return (
    <>
      <StyledWrapper>
        {navigationSidebar}
        <StyledContainer>
          <main>{children}</main>
          {footerBar}
        </StyledContainer>
        <StyledSpringBottom src="/springs-bg.png" />
      </StyledWrapper>
    </>
  )
}

const StyledWrapper = styled('div', {
  display: 'grid',
  minHeight: '100vh',
  gridTemplateColumns: '18rem 1fr',
  backgroundColor: '$backgroundColors$base',
})

const StyledContainer = styled('div', {
  position: 'relative',
  zIndex: '$2',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '0 $12',
  '& main': {
    maxWidth: '44rem',
  },
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
