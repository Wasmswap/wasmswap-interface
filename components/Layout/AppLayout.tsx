import { media, styled, useMedia } from 'junoblocks'
import { APP_MAX_WIDTH, MAIN_PANE_MAX_WIDTH } from 'util/constants'

import { ExtensionSidebar } from './ExtensionSidebar'
import { FooterBar } from './FooterBar'
import { NavigationSidebar } from './NavigationSidebar'

export const AppLayout = ({
  navigationSidebar = <NavigationSidebar />,
  extensionSidebar = <ExtensionSidebar />,
  footerBar = <FooterBar />,
  children,
}) => {
  const isSmallScreen = useMedia('sm')
  const isMediumScreen = useMedia('md')

  if (isSmallScreen) {
    return (
      <StyledWrapperForMobile>
        <StyledContainerForMobile>
          {navigationSidebar}

          <main data-content="">{children}</main>
        </StyledContainerForMobile>

        <StyledContainerForMobile>
          <div data-content="">{footerBar}</div>
        </StyledContainerForMobile>
      </StyledWrapperForMobile>
    )
  }

  return (
    <StyledWrapper>
      {navigationSidebar}

      <StyledContainer>
        <main>{children}</main>
      </StyledContainer>

      {!isMediumScreen && extensionSidebar}
    </StyledWrapper>
  )
}

const StyledWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '$backgroundColors$base',
  width: APP_MAX_WIDTH,
  maxWidth: '100%',
  margin: '0 auto',
  [media.md]: {
    gridTemplateColumns: '15rem 1fr',
  },
})

const StyledContainer = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '0 $24 $24 $24',
  '& main': {
    margin: '0 auto',
    width: '100%',
  },
  maxWidth: '100%',
  width: MAIN_PANE_MAX_WIDTH,
  [media.sm]: {},
})

const StyledWrapperForMobile = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '100vh',
  backgroundColor: '$backgroundColors$base',
})

const StyledContainerForMobile = styled('div', {
  position: 'relative',
  zIndex: '$1',
  '& [data-content]': {
    margin: '0 auto',
    width: '100%',
    padding: '0 $12',
  },
})
