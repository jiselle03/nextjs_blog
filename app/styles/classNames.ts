interface StyleType {
  color?: ColorType
  size?: IconSizeType
}

interface BorderType {
  type?: 'main' | 'input'
  size?: SizeType
}

interface ButtonType {
  type?: 'cancel' | 'confirm'
  width?: string
}

// Color
export const Color = {
  light: 'gray-300',
  medium: 'gray-500',
  dark: 'gray-800',
  red: 'red-500',
}

type ColorType = keyof typeof Color

export const ButtonColor = {
  gray: 'bg-gray-500',
  'gray-hover': 'hover:bg-gray-800',
  blue: 'bg-blue-600',
  'blue-hover': 'hover:bg-blue-700',
}

// Size
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

export const iconSize = 'h-6 w-6'

export const inputClassNames = ''

export const iconClassNames = ({
  color = 'dark',
  size = 'small',
}: StyleType): string => {
  return `cursor-pointer ${IconSize[size]} text-${Color[color]}`
}

export const buttonClassNames = ({
  type = 'confirm',
  width = '',
}: ButtonType) => {
  const color = type === 'cancel' ? ButtonColor.gray : ButtonColor.blue
  const hoverColor =
    type === 'cancel' ? ButtonColor['gray-hover'] : ButtonColor['blue-hover']

  return `py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${color} ${hoverColor} ${width} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600`
}

export const borderClassNames = ({ size, type = 'main' }: BorderType) => {
  const sizeName = size ? `-${Size[size]}` : ''

  if (type === 'input') {
    return `border-b-2 border-${Color.light}`
  }

  return `border border-${Color.light} rounded${sizeName}`
}

export const badgeClassNames = ({}) => `border rounded-2xl px-2 py-1`

export const tagClassNames = ({}) =>
  `cursor-pointer text-${Color.medium} text-xs`
