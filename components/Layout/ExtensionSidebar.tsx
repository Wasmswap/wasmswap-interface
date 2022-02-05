import { styled } from '../theme'
import { ErrorIcon } from 'icons/Error'
import { Text } from 'components/Text'
import { __TEST_MODE__ } from '../../util/constants'
import { Button } from 'components/Button'
import { UpRightArrowIcon } from '../../icons/UpRightArrow'

export const ExtensionSidebar = () => {
  return (
    <StyledDivForWrapper>
      <StyledDivForTitleWrapper>
        <ErrorIcon color="primary" size="24px" />
        <Text>This is a {__TEST_MODE__ ? 'testnet' : 'beta'} version</Text>
      </StyledDivForTitleWrapper>
      <Text css={{ padding: '$9 0 $11' }}>
        This website is currently{' '}
        {__TEST_MODE__ ? 'operates in testnet mode' : 'in beta'}. Please provide
        feedback.
      </Text>
      <Button
        as="a"
        href={process.env.NEXT_PUBLIC_FEEDBACK_LINK}
        target="__blank"
        variant="secondary"
        iconRight={<UpRightArrowIcon />}
        css={{ width: '100%' }}
      >
        Report an issue
      </Button>
      <StyledSpringBottom src="/springs-bg.png" />
    </StyledDivForWrapper>
  )
}

const StyledDivForWrapper = styled('div', {
  zIndex: '$2',
  position: 'sticky',
  backgroundColor: '$colors$light50',
  top: 0,
  right: 0,
  width: '100%',
  height: '100%',
  maxHeight: '100vh',
  padding: '$11 $12',
})

const StyledDivForTitleWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  columnGap: '$4',
})

const StyledSpringBottom = styled('img', {
  position: 'absolute',
  right: 0,
  bottom: 0,
  width: '125%',
  maxWidth: '500px',
  zIndex: '$1',
  userSelect: 'none',
  userDrag: 'none',
})
