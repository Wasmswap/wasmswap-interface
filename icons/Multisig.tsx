import { createIcon } from './createIconComponent'
import { SVGProps } from 'react'

export const [Multisig, MultisigIcon] = createIcon(
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
        d="M12 14.6861L6.97629 10.4997L12 6.31324L17.0237 10.4997L12 14.6861ZM11.5999 5.01953L5.59989 10.0195V10.9798L11.5999 15.9798H12.4001L18.4001 10.9798V10.0195L12.4001 5.01953H11.5999ZM6.40012 13.0195L5.91998 12.6194L5.11975 13.5797L5.59989 13.9798L11.5999 18.9798H12.4001L18.4001 13.9798L18.8803 13.5797L18.08 12.6194L17.5999 13.0195L12 17.6861L6.40012 13.0195Z"
        fill="currentColor"
      />
    </svg>
  )
)
