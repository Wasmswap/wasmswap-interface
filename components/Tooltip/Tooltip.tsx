import { useTooltip, TooltipPopup, Position } from '@reach/tooltip'
import { useTransition, animated } from '@react-spring/web'
import {
  cloneElement,
  ComponentProps,
  ReactElement,
  useEffect,
  useState,
} from 'react'
import { Text } from '../Text'
import { styled } from '../theme'

type TooltipProps = Omit<ComponentProps<typeof TooltipPopup>, 'triggerRect'> & {
  delayHidingOnClick?: boolean
  delayHidingOnClickTimeoutMs?: number
  children: ReactElement
}

const OFFSET_DEFAULT = 8

export const position: Position = (
  triggerRect,
  tooltipRect,
  offset = OFFSET_DEFAULT
) => {
  const { innerWidth: windowWidth, innerHeight: windowHeight } = window

  if (!triggerRect || !tooltipRect) {
    return {}
  }

  let collisions = {
    top: triggerRect.top - tooltipRect.height < 0,
    right: windowWidth < triggerRect.left + tooltipRect.width,
    bottom: windowHeight < triggerRect.bottom + tooltipRect.height + offset,
    left: triggerRect.left - tooltipRect.width < 0,
  }

  let directionRight = collisions.right && !collisions.left
  let directionUp = collisions.bottom && !collisions.top

  return {
    left: directionRight
      ? `${triggerRect.right - tooltipRect.width + window.pageXOffset}px`
      : `${
          triggerRect.left +
          triggerRect.width / 2 -
          tooltipRect.width / 2 +
          window.pageXOffset
        }px`,
    top: directionUp
      ? `${
          triggerRect.top - offset - tooltipRect.height + window.pageYOffset
        }px`
      : `${
          triggerRect.top + offset + triggerRect.height + window.pageYOffset
        }px`,
  }
}

export function Tooltip({
  children,
  label,
  delayHidingOnClick,
  delayHidingOnClickTimeoutMs = 1500,
  ...props
}: TooltipProps) {
  const [overrideIsVisible, setOverrideIsVisible] = useState<
    boolean | undefined
  >(undefined)

  const [trigger, tooltip, isVisible] = useTooltip({
    onMouseDown: () => {
      if (delayHidingOnClick) {
        setOverrideIsVisible(true)
      }
    },
  })

  useEffect(() => {
    if (delayHidingOnClick && overrideIsVisible) {
      let timeout = setTimeout(() => {
        setOverrideIsVisible(undefined)
      }, delayHidingOnClickTimeoutMs)

      return () => clearTimeout(timeout)
    }
  }, [overrideIsVisible, delayHidingOnClick, delayHidingOnClickTimeoutMs])

  const isShowing =
    typeof overrideIsVisible === 'boolean' ? overrideIsVisible : isVisible

  tooltip.isVisible = isShowing

  const transitions = useTransition(isShowing, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  return (
    <>
      {cloneElement(children, trigger)}
      {transitions(
        ({ opacity }, item) =>
          item && (
            <StyledTooltip
              {...tooltip}
              {...props}
              position={position}
              style={{
                opacity: opacity.interpolate((value) => {
                  if (!tooltip.isVisible) return 0
                  return value
                }),
              }}
              label={
                <Text as="div" variant="caption" color="white">
                  {label}
                </Text>
              }
            />
          )
      )}
    </>
  )
}

const StyledTooltip = styled(animated(TooltipPopup), {
  position: 'absolute',
  backgroundColor: '$backgroundColors$tooltip',
  boxShadow: '0px 4px 10px 0px $colors$dark15, 0 0 0 1px $colors$dark20',
  padding: '$4 $6',
  borderRadius: '$1',
  zIndex: 999,
})
