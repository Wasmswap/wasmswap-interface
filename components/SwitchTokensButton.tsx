import React, { useState, FC } from 'react'
import styled from 'styled-components'
import { restStylesForButton } from './Button'
import { colorTokens } from '../util/constants'

type SwitchTokensButtonProps = { onClick: () => void }

export const SwitchTokensButton: FC<SwitchTokensButtonProps> = ({
  onClick,
}) => {
  const [flipped, setFlipped] = useState(false)

  function handleClick() {
    setFlipped((val) => !val)
    if (typeof onClick === 'function') onClick()
  }

  return (
    <StyledWrapper>
      <StyledButton onClick={handleClick} $flipped={flipped}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <path d="M12.9839 4.99295C12.9837 4.77572 13.0542 4.56433 13.1848 4.39075C13.3154 4.21716 13.4989 4.09082 13.7077 4.03083C13.9165 3.97084 14.1391 3.98047 14.342 4.05825C14.5448 4.13603 14.7168 4.27774 14.8319 4.46195L17.5199 7.14995C17.6127 7.24286 17.6864 7.35315 17.7366 7.47451C17.7868 7.59588 17.8126 7.72595 17.8126 7.8573C17.8125 7.98865 17.7866 8.1187 17.7363 8.24004C17.686 8.36137 17.6123 8.4716 17.5194 8.56445C17.4265 8.65729 17.3162 8.73093 17.1948 8.78115C17.0735 8.83137 16.9434 8.8572 16.812 8.85715C16.6807 8.8571 16.5506 8.83119 16.4293 8.78088C16.308 8.73057 16.1977 8.65686 16.1049 8.56395L14.9849 7.44295V14.9929C14.9849 15.2582 14.8795 15.5125 14.692 15.7001C14.5045 15.8876 14.2501 15.9929 13.9849 15.9929C13.7197 15.9929 13.4653 15.8876 13.2778 15.7001C13.0902 15.5125 12.9849 15.2582 12.9849 14.9929V4.99295H12.9839Z" />
          <path d="M11.016 19.007C11.0162 19.2242 10.9457 19.4356 10.8151 19.6092C10.6845 19.7827 10.5009 19.9091 10.2921 19.9691C10.0833 20.0291 9.86071 20.0194 9.65789 19.9417C9.45507 19.8639 9.28309 19.7222 9.16796 19.538L6.47996 16.85C6.29245 16.6623 6.18716 16.4079 6.18726 16.1426C6.18735 15.8773 6.29282 15.623 6.48046 15.4355C6.6681 15.248 6.92254 15.1427 7.18781 15.1428C7.45308 15.1428 7.70745 15.2483 7.89496 15.436L9.01496 16.557V9.00696C9.01496 8.74174 9.12031 8.48739 9.30785 8.29985C9.49539 8.11232 9.74974 8.00696 10.015 8.00696C10.2802 8.00696 10.5345 8.11232 10.7221 8.29985C10.9096 8.48739 11.015 8.74174 11.015 9.00696V19.007H11.016Z" />
        </svg>
      </StyledButton>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  height: 4px;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledButton = styled.button<{ $flipped: boolean }>`
  ${restStylesForButton};
  padding: 3px;
  background-color: ${colorTokens.white};
  border-radius: 50%;
  transition: color 0.1s ease-out, background-color 0.1s ease-out,
    opacity 0.1s ease-out;
  color: ${colorTokens.black};
  & svg {
    display: block;
    transition: transform 0.08s ease-out;
    transform: rotateX(${(p) => (p.$flipped ? 180 : 0)}deg);
  }
  &:hover {
    background-color: ${colorTokens.black};
    color: ${colorTokens.white};
  }
  &:active {
    opacity: 0.85;
  }
`
