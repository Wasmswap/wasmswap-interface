import { createIcon } from './createIconComponent'
import { SVGProps } from 'react'

export const [Search, SearchIcon] = createIcon(
  (props: SVGProps<SVGSVGElement>) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.625 7C2.625 4.58375 4.58375 2.625 7 2.625C9.41625 2.625 11.375 4.58375 11.375 7C11.375 9.41625 9.41625 11.375 7 11.375C4.58375 11.375 2.625 9.41625 2.625 7ZM7 1.375C3.8934 1.375 1.375 3.8934 1.375 7C1.375 10.1066 3.8934 12.625 7 12.625C8.32813 12.625 9.54876 12.1647 10.5111 11.3949L13.3081 14.1919L13.75 14.6339L14.6339 13.75L14.1919 13.3081L11.3949 10.5111C12.1647 9.54876 12.625 8.32813 12.625 7C12.625 3.8934 10.1066 1.375 7 1.375Z"
        fill="currentColor"
      />
    </svg>
  )
)
