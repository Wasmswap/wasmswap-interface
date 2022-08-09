import { Card, CardContent, Column } from 'junoblocks'

export const BaseCardForEmptyState = ({ content, footer, ...props }) => {
  return (
    <Card
      variant="ghost"
      css={{
        display: 'flex',
        padding: '$17 0',
        height: '100%',
        ...(props.css ?? {}),
      }}
      {...props}
    >
      <Column align="center" justifyContent="space-between" css={{ flex: 1 }}>
        <CardContent
          css={{
            paddingBottom: '$16',
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            maxWidth: '18rem',
          }}
        >
          {content}
        </CardContent>
        {footer}
      </Column>
    </Card>
  )
}
