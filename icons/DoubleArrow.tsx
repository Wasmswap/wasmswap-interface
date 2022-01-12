import { SVGProps } from 'react'

export const DoubleArrow = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <path
        d="M8 2.5L8 13.5M8 2.5L5 5.5M8 2.5L11 5.5M8 13.5L5 10.5M8 13.5L11 10.5"
        stroke="currentColor"
        strokeOpacity="0.9"
        strokeWidth="1.25"
        strokeLinecap="square"
        strokeLinejoin="bevel"
      />
    </svg>
  )
}
