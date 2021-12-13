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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 40px;
  & main {
    max-width: ${590 + 80}px;
  }
`