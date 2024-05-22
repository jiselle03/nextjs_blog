interface StyleType {
  color?: ColorType
  size?: IconSizeType
}

const Color = {
  light: 'gray-300',
  dark: 'gray-800',
  red: 'red-500',
}

type ColorType = keyof typeof Color

const IconSize = {
  small: 'h-5 w-5',
  large: 'h-6 w-6',
}

type IconSizeType = keyof typeof IconSize

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

export const borderClassNames = ({}) => `border border-${Color.light} rounded`
