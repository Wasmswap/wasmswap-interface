import { IconWrapper, IconWrapperProps } from '../components/IconWrapper'

export const createIconComponent = (IconComponent: any) => {
  function Icon(props: Omit<IconWrapperProps, 'icon'>) {
    return <IconWrapper {...props} icon={<IconComponent />} />
  }

  Icon.displayName = IconComponent.displayName

  return Icon
}

export const createIcon = (IconComponent: any) => [
  IconComponent,
  createIconComponent(IconComponent),
]
