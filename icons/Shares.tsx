import { createIcon } from './createIconComponent'
import { SVGProps } from 'react'

export const [Shares, SharesIcon] = createIcon(
  (props: SVGProps<SVGSVGElement>) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 6.625V12L8.1993 8.1993C7.22662 9.17198 6.625 10.5157 6.625 12C6.625 14.9685 9.03147 17.375 12 17.375C14.9685 17.375 17.375 14.9685 17.375 12C17.375 9.03147 14.9685 6.625 12 6.625ZM12 5.375C8.34111 5.375 5.375 8.34111 5.375 12C5.375 15.6589 8.34111 18.625 12 18.625C15.6589 18.625 18.625 15.6589 18.625 12C18.625 8.34111 15.6589 5.375 12 5.375Z"
        fill="currentColor"
      />
    </svg>
  )
)
