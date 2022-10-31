import { AppLayout, PageHeader, Row } from 'components'
import { Text, styled } from 'junoblocks'

const TokenPickerWrapper = styled('div', {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '60px 0',
  cursor: 'pointer',
  backgroundColor: '$backgroundColors$primary',
  borderRadius: '6px',
})

const TokenPickerIconPlaceholder = styled('div', {
  border: '1px solid #ccc',
  backgroundColor: '#ccc',
  width: 50,
  height: 50,
  borderRadius: '50%',
  marginBottom: '20px',
})

const TokenPicker = () => {
  return (
    <TokenPickerWrapper>
      <TokenPickerIconPlaceholder />
      <Text variant="hero">Token</Text>
      <Text style={{ marginTop: '60px' }}>Pick a token +</Text>
    </TokenPickerWrapper>
  )
}

const PoolsCreate = () => {
  return (
    <AppLayout>
      <PageHeader title="Pool Creation" subtitle="" />
      <Row style={{ gap: '2px' }}>
        <TokenPicker />
        <TokenPicker />
      </Row>
    </AppLayout>
  )
}

export default PoolsCreate
