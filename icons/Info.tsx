import { SVGProps } from 'react'

import { createIcon } from './createIconComponent'

export const [Info, InfoIcon] = createIcon((props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.3333 15.3333H12.6667V11.3333H11.3333V15.3333ZM12 5.33333C8.32 5.33333 5.33334 8.31999 5.33334 12C5.33334 15.68 8.32 18.6667 12 18.6667C15.68 18.6667 18.6667 15.68 18.6667 12C18.6667 8.31999 15.68 5.33333 12 5.33333ZM12 17.3333C9.06 17.3333 6.66667 14.94 6.66667 12C6.66667 9.06 9.06 6.66666 12 6.66666C14.94 6.66666 17.3333 9.06 17.3333 12C17.3333 14.94 14.94 17.3333 12 17.3333ZM11.3333 10H12.6667V8.66666H11.3333V10Z"
      fill="currentColor"
    />
  </svg>
))
