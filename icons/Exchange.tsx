import { SVGProps } from 'react'

export const Exchange = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 4L8 14M8 4L4 8M8 4L12 8"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
        strokeLinejoin="bevel"
      />
      <path
        d="M16 20L16 10M16 20L12 16M16 20L20 16"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
        strokeLinejoin="bevel"
      />
    </svg>
  )
}
