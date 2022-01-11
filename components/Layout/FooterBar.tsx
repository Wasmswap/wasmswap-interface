import { Text } from '../Text'
import { styled } from '../theme'
import { Button } from '../Button'
import { UpRightArrow } from '../../icons/UpRightArrow'
import { IconWrapper } from '../IconWrapper'
import { APP_NAME } from '../../util/constants'

export const FooterBar = () => {
  return (
    <StyledFooter>
      <Text variant="legend" css={{ paddingRight: '$20' }}>
        {APP_NAME} v{process.env.NEXT_PUBLIC_APP_VERSION}
      </Text>
      <StyledDivForGrid>
        <Button
          as="a"
          href={process.env.NEXT_PUBLIC_FEEDBACK_LINK}
          target="__blank"
          variant="ghost"
          iconRight={<IconWrapper icon={<UpRightArrow />} />}
        >
          Provide feedback
        </Button>
      </StyledDivForGrid>
    </StyledFooter>
  )
}

const StyledFooter = styled('footer', {
  padding: '$12 0',
  alignItems: 'center',
  display: 'flex',
})

const StyledDivForGrid = styled('div', {
  display: 'flex',
  alignItems: 'center',
  columnGap: '$space$14',
})
