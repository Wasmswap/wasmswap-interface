import { SVGProps } from 'react'

export const Chevron = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.875 14.375L7.5 10L11.875 5.625"
      stroke="currentColor"
      strokeWidth="1.5625"
      strokeLinecap="square"
      strokeLinejoin="bevel"
    />
  </svg>
)
