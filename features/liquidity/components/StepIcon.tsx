import { Inline, Text } from 'junoblocks'

export const StepIcon = ({ step }) => {
  return (
    <Inline
      css={{
        borderRadius: '50%',
        padding: '$3 $6',
        backgroundColor: '$colors$brand20',
      }}
    >
      <Text color="brand" variant="link">
        {step}
      </Text>
    </Inline>
  )
}
