import styled from 'styled-components'
import { NavigationSidebar } from './NavigationSidebar'
import { FooterBar } from '../FooterBar'

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

const StyledWrapper = styled.div`
  display: grid;
  min-height: 100vh;
  grid-template-columns: 264px 1fr;
  background-color: #fff;
`

const StyledContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 40px;
  & main {
    max-width: ${590 + 80}px;
  }
`

const StyledSpringBottom = styled.img`
  position: fixed;
  right: 0;
  bottom: 0;
  width: 35%;
  max-width: 500px;
  z-index: 0;
  user-select: none;
  user-drag: none;
`
