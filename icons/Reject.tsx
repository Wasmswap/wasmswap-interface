import { createIcon } from './createIconComponent'
import { SVGProps } from 'react'

export const [Reject, RejectIcon] = createIcon(
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
        d="M12 6.625C9.03147 6.625 6.625 9.03147 6.625 12C6.625 14.9685 9.03147 17.375 12 17.375C14.9685 17.375 17.375 14.9685 17.375 12C17.375 9.03147 14.9685 6.625 12 6.625ZM5.375 12C5.375 8.34111 8.34111 5.375 12 5.375C15.6589 5.375 18.625 8.34111 18.625 12C18.625 15.6589 15.6589 18.625 12 18.625C8.34111 18.625 5.375 15.6589 5.375 12ZM14.8839 10L14.4419 10.4419L12.8839 12L14.4419 13.5581L14.8839 14L14 14.8839L13.5581 14.4419L12 12.8839L10.4419 14.4419L10 14.8839L9.11612 14L9.55806 13.5581L11.1161 12L9.55806 10.4419L9.11612 10L10 9.11612L10.4419 9.55806L12 11.1161L13.5581 9.55806L14 9.11612L14.8839 10Z"
        fill="currentColor"
      />
    </svg>
  )
)
