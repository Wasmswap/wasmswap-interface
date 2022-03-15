import { Card,CardContent, Column } from 'components'
import { ArrowUpIcon } from 'icons'

export const BaseCardForEmptyState = ({
  children,
  pointerVisible = true,
  ...props
}) => {
  return (
    <Card
      {...props}
      variant="ghost"
      css={{ display: 'flex', padding: '$30 0 $18', ...(props.css ?? {}) }}
    >
      <Column align="center" justifyContent="space-between" css={{ flex: 1 }}>
        <CardContent css={{ paddingBottom: '$16' }}>{children}</CardContent>
        <Column css={{ paddingTop: '$16' }} align="center">
          <ArrowUpIcon visible={pointerVisible} rotation="-90deg" />
        </Column>
      </Column>
    </Card>
  )
}
