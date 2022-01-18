import { createIcon } from './createIconComponent'
import { SVGProps } from 'react'

export const [Plus, PlusIcon] = createIcon((props: SVGProps<SVGSVGElement>) => (
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
      d="M12.625 7V6.375H11.375V7V11.375H7H6.375V12.625H7H11.375V17V17.625H12.625V17V12.625H17H17.625V11.375H17H12.625V7Z"
      fill="currentColor"
    />
  </svg>
))
