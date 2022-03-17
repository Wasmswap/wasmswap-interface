import { Button } from './Button'
import { Inline } from './Inline'

type SegmentedControlProps = {
  activeValue: any
  values: Array<{ value: any; label: any }>
  onChange: (value: { value: any; label: any }, event: MouseEvent) => void
}

export const SegmentedControl = ({
  activeValue,
  values,
  onChange,
}: SegmentedControlProps) => {
  return (
    <Inline>
      {values.map((element) => (
        <Button
          key={element.value}
          variant="ghost"
          selected={element.value === activeValue}
          onClick={(event) => onChange(element, event)}
          css={{ flex: 1 }}
        >
          {element.label || element.value}
        </Button>
      ))}
    </Inline>
  )
}
