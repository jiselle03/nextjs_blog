interface StyleType {
  color?: ColorType
  size?: IconSizeType
}

interface BorderType {
  size?: SizeType
}

export const Color = {
  light: 'gray-300',
  medium: 'gray-500',
  dark: 'gray-800',
  red: 'red-500',
}

type ColorType = keyof typeof Color

const IconSize = {
  'x-small': 'h-3 w-3',
  small: 'h-5 w-5',
  large: 'h-6 w-6',
}

type IconSizeType = keyof typeof IconSize

const Size = {
  large: 'lg',
  medium: 'md',
  small: 'sm',
}

type SizeType = keyof typeof Size

// Size
export const iconSize = 'h-6 w-6'

export const inputClassNames = ''
export const buttonClassNames = ''

export const iconClassNames = ({
  color = 'dark',
  size = 'small',
}: StyleType): string => {
  return `cursor-pointer ${IconSize[size]} text-${Color[color]}`
}

export const borderClassNames = ({ size }: BorderType) => {
  const sizeName = size ? `-${Size[size]}` : ''

  return `border border-${Color.light} rounded${sizeName}`
}

export const badgeClassNames = ({}) => `border rounded-2xl px-2 py-1`

export const tagClassNames = ({}) =>
  `cursor-pointer text-${Color.medium} text-xs`
