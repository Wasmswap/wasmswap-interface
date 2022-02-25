import { ArrowUpIcon } from '../../../icons/ArrowUp'
import { Button, ButtonProps } from '../../../components/Button'

export const AprPill = (
  props: Omit<ButtonProps, 'children' | 'variant' | 'selected' | 'iconLeft'>
) => (
  <Button
    {...props} // @ts-ignore
    variant="menu"
    selected={true}
    iconLeft={<ArrowUpIcon rotation="45deg" />}
  >
    158% APR
  </Button>
)
