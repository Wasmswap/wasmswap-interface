import { Tooltip } from './Tooltip'
import { ReactElement, useEffect, useState } from 'react'
import { IconWrapper } from '../IconWrapper'
import { Valid } from '../../icons/Valid'
import { styled } from '../theme'

type CopyTextTooltipProps = {
  label: string
  ariaLabel: string
  successLabel: string
  value: string
  children: (bind: {
    onClick: () => void
    onMouseLeave: () => void
    copied: boolean
  }) => ReactElement
  successStateShowingTimeMs?: number
}

export const CopyTextTooltip = ({
  label,
  ariaLabel,
  successLabel,
  value,
  children,
  successStateShowingTimeMs = 1500,
}: CopyTextTooltipProps) => {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(value)
    setCopied(true)
  }

  function handleDismiss() {
    setCopied(false)
  }

  useDismissCopiedState({
    copied,
    setCopied,
    timeoutMs: successStateShowingTimeMs,
  })

  return (
    <Tooltip
      delayHidingOnClick={true}
      delayHidingOnClickTimeoutMs={successStateShowingTimeMs}
      label={
        <StyledDivForToastContent>
          {copied ? (
            <>
              <IconWrapper icon={<Valid />} color="valid" size="24px" />
              {successLabel}
            </>
          ) : (
            label
          )}
        </StyledDivForToastContent>
      }
      aria-label={ariaLabel}
    >
      {children({ onClick: handleCopy, onMouseLeave: handleDismiss, copied })}
    </Tooltip>
  )
}

const useDismissCopiedState = ({ copied, setCopied, timeoutMs }) => {
  useEffect(() => {
    if (copied) {
      let timeout = setTimeout(() => {
        setCopied(false)
      }, timeoutMs)

      return () => clearTimeout(timeout)
    }
  }, [copied, setCopied, timeoutMs])
}

const StyledDivForToastContent = styled('div', {
  display: 'flex',
  alignItems: 'center',
  columnGap: '$space$2',
})
