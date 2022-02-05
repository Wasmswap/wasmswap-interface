import { createIcon } from './createIconComponent'
import { SVGProps } from 'react'

export const [Moon, MoonIcon] = createIcon((props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.2776 7C8.35748 7.75857 7 9.62129 7 11.8191C7 14.6726 9.32828 17 12.183 17C14.3611 17 16.2364 15.6468 17 13.7327C16.6911 13.7822 16.3769 13.8043 16.0581 13.8043C12.8095 13.8043 10.197 11.1928 10.197 7.94548C10.197 7.62074 10.2271 7.30536 10.2776 7Z"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
))
