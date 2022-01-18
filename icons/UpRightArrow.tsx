import { SVGProps } from 'react'
import { createIcon } from './createIconComponent'

export const [UpRightArrow, UpRightArrowIcon] = createIcon(
  (props: SVGProps<SVGSVGElement>) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.5358 4.46447L4.46469 11.5355M11.5358 4.46447L6.00037 4.46448M11.5358 4.46447L11.5358 10.0001"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
        strokeLinejoin="bevel"
      />
    </svg>
  )
)
