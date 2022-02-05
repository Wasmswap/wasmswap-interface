import { styled } from './theme'

type ToggleSwitchProps = {
  id: string
  name: string
  checked: boolean
  onChange: (checked: boolean) => void
  optionLabels: [string, string]
  disabled?: boolean
}

export const ToggleSwitch = ({
  id,
  name,
  checked,
  onChange,
  optionLabels,
  disabled,
}: ToggleSwitchProps) => {
  return (
    <StyledDivForWrapper checked={checked}>
      <StyledInputForCheckbox
        type="checkbox"
        name={name}
        id={id}
        checked={checked}
        onChange={(e) => {
          onChange(Boolean(e.target.checked))
        }}
        disabled={disabled}
      />
      {id ? (
        <StyledLabelForContainer htmlFor={id}>
          <StyledSpanForCircle
            checked={checked}
            data-yes={optionLabels[0]}
            data-no={optionLabels[1]}
          />
        </StyledLabelForContainer>
      ) : null}
    </StyledDivForWrapper>
  )
}

const StyledSpanForCircle = styled('span', {
  width: '0.75rem',
  height: '0.75rem',
  borderRadius: '50%',
  transition: 'background-color .1s ease-out, transform .1s ease-out',
  cursor: 'pointer',
  variants: {
    checked: {
      true: {
        transform: 'translateX(0.5rem)',
      },
    },
  },
})

const StyledDivForWrapper = styled('div', {
  /* set up the token variables */
  $$backgroundColor: '$colors$white',
  $$backgroundColorOnHover: '$colors$white',
  $$backgroundColorOnFocus: '$colors$white',
  $$backgroundColorOnActive: '$colors$white',
  $$activeBackgroundColor: '$$backgroundColor',

  $$borderColor: '$borderColors$inactive',
  $$borderColorOnHover: '$borderColors$focus',
  $$borderColorOnFocus: '$borderColors$selected',
  $$borderColorOnActive: '$borderColors$selected',
  $$activeBorderColor: '$$borderColor',

  $$borderSize: '1px',
  $$borderSizeOnHover: '$$borderSize',
  $$borderSizeOnActive: '2px',
  $$borderSizeOnFocus: '2px',
  $$activeBorderSize: '$$borderSize',

  $$circleColor: '$colors$dark95',
  $$circleColorOnHover: '$colors$black',
  $$circleColorOnFocus: '$colors$dark95',
  $$circleColorOnActive: '$colors$dark85',
  $$activeCircleColor: '$$circleColor',

  /* set up the styles */
  position: 'relative',
  zIndex: '$1',
  borderRadius: '90px',
  display: 'flex',
  padding: '$1',
  width: '1.5rem',
  cursor: 'pointer',
  transition: 'box-shadow 0.1s ease-out, background-color 0.1s ease-out',

  /* set up colors & params on static state */
  userSelect: 'none',
  backgroundColor: '$$activeBackgroundColor',
  boxShadow: '0 0 0 $$activeBorderSize $$activeBorderColor',

  [`& ${StyledSpanForCircle}`]: {
    backgroundColor: '$$activeCircleColor',
  },

  /* set up colors & params dynamic states */
  '&:hover': {
    $$activeBorderColor: '$$borderColorOnHover',
    $$activeCircleColor: '$$circleColorOnHover',
    $$activeBackgroundColor: '$$backgroundColorOnHover',
    $$activeBorderSize: '$$borderSizeOnHover',
  },

  '&:focus': {
    $$activeBorderColor: '$$borderColorOnFocus',
    $$activeCircleColor: '$$circleColorOnFocus',
    $$activeBackgroundColor: '$$backgroundColorOnFocus',
    $$activeBorderSize: '$$borderSizeOnFocus',
  },

  '&:active': {
    $$activeBorderColor: '$$borderColorOnActive',
    $$activeCircleColor: '$$circleColorOnActive',
    $$activeBackgroundColor: '$$backgroundColorOnActive',
    $$activeBorderSize: '$$borderSizeOnActive',
  },

  variants: {
    checked: {
      true: {
        $$backgroundColor: '$colors$dark95',
        $$backgroundColorOnHover: '$colors$black',
        $$backgroundColorOnFocus: '$colors$dark95',
        $$backgroundColorOnActive: '$colors$dark85',

        $$circleColorOnHover: '$colors$white',
        $$circleColorOnFocus: '$colors$white',
        $$circleColorOnActive: '$colors$white95',
        $$activeCircleColor: '$colors$white',

        $$borderColor: '$colors$dark0',
        $$borderColorOnHover: '$colors$dark0',
        $$borderColorOnFocus: '$borderColors$selected',
        $$borderColorOnActive: '$colors$dark0',
        $$activeBorderColor: '$colors$dark0',

        $$borderSize: '1px',
        $$borderSizeOnHover: '$$borderSize',
        $$borderSizeOnActive: '$$borderSize',
        $$borderSizeOnFocus: '2px',
      },
      false: {},
    },
  },
})

const StyledInputForCheckbox = styled('input', {
  opacity: 0,
  width: '100%',
  height: '100%',
  display: 'block',
  position: 'absolute',
  zIndex: '$2',
  inset: 0,
  cursor: 'pointer',
  userSelect: 'none',
})

const StyledLabelForContainer = styled('label', {
  display: 'flex',
  position: 'relative',
  zIndex: '$1',
})
