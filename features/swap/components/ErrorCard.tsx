import { styled, Text, IconWrapper, Error } from 'junoblocks'

export const ErrorCard = ({ children }) => {
  return (
    <ErrorCardWrapper>
      <IconWrapper icon={<Error />} color="error" />
      <Text color="error">{children}</Text>
    </ErrorCardWrapper>
  )
}

const ErrorCardWrapper = styled('div', {
  backgroundColor: '$backgroundColors$error',
  borderColor: '$colors$error60',
  borderWidth: '1px',
  borderRadius: '$2',
  padding: '$6 $13',
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
})
