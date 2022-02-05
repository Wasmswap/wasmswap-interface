import { SVGProps } from 'react'
import { createIcon } from './createIconComponent'

export const [Error, ErrorIcon] = createIcon(
  (props: SVGProps<SVGSVGElement>) => {
    return (
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
          d="M12.5487 5.70117L18.5487 16.7012L18 17.6255L5.99998 17.6255L5.45129 16.7012L11.4513 5.70117L12.5487 5.70117ZM12 7.30566L7.05282 16.3755L16.9471 16.3755L12 7.30566Z"
          fill="currentColor"
        />
      </svg>
    )
  }
)
