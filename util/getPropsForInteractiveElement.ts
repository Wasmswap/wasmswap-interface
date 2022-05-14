import { KeyboardEvent, MouseEvent } from 'react'

type Args = {
  onClick: (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void
}

export const getPropsForInteractiveElement = ({ onClick }: Args) => ({
  role: 'button',
  onClick,
  onKeyDown(event: KeyboardEvent<HTMLElement>) {
    const { code } = event
    const shouldToggleSelector = ['space', 'enter'].includes(code.toLowerCase())
    if (shouldToggleSelector) {
      onClick(event)
    }
  },
  tabIndex: 0,
})
