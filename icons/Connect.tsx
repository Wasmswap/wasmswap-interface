import { SVGProps } from 'react'
import { createIcon } from './createIconComponent'

export const [Connect, ConnectIcon] = createIcon(
  (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M4.16072 7.70801C3.44893 8.33625 3 9.25541 3 10.2794C3 12.173 4.53502 13.708 6.42857 13.708C7.45259 13.708 8.37176 13.2591 9 12.5473"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="square"
          strokeLinejoin="bevel"
        />
        <path
          d="M11.8393 9.70801C12.5511 9.07977 13 8.1606 13 7.13658C13 5.24303 11.465 3.70801 9.57143 3.70801C8.54741 3.70801 7.62824 4.15694 7 4.86873"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="square"
          strokeLinejoin="bevel"
        />
        <path
          d="M7 9.70801L9 7.70801"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="square"
          strokeLinejoin="bevel"
        />
      </svg>
    )
  }
)
