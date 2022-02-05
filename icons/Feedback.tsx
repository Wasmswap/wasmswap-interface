import { createIcon } from './createIconComponent'
import { SVGProps } from 'react'

export const [Feedback, FeedbackIcon] = createIcon(
  (props: SVGProps<SVGSVGElement>) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18.66 6.66683C18.66 5.9335 18.0667 5.3335 17.3334 5.3335H6.66671C5.93337 5.3335 5.33337 5.9335 5.33337 6.66683V14.6668C5.33337 15.4002 5.93337 16.0002 6.66671 16.0002H16L18.6667 18.6668L18.66 6.66683ZM17.3334 6.66683V15.4468L16.5534 14.6668H6.66671V6.66683H17.3334ZM8.00004 12.0002H16V13.3335H8.00004V12.0002ZM8.00004 10.0002H16V11.3335H8.00004V10.0002ZM8.00004 8.00016H16V9.3335H8.00004V8.00016Z"
        fill="currentColor"
      />
    </svg>
  )
)
