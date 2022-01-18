import { IconWrapper, IconWrapperProps } from '../components/IconWrapper'
import { ComponentType } from 'react'

export function createIconComponent<T extends ComponentType = any>(icon: T) {
  const IconComponent = icon as any
  return function Icon(props: Omit<IconWrapperProps, 'icon'>) {
    return <IconWrapper {...props} icon={<IconComponent />} />
  }
}

export function createIcon<T extends ComponentType>(IconComponent: T) {
  return [IconComponent, createIconComponent(IconComponent)] as const
}
