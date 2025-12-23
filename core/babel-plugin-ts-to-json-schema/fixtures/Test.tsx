export const _PropsJsonSchema = {/* ButtonProps */} // used in docs generation
export interface ButtonProps {
  /** color name @default 'secondary' */
  color?: string
  /** variant @default 'outlined' */
  variant?: 'flat' | 'outlined' | 'text'
  /** size @default 'm' */
  size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'
  /** icon component */
  icon?: any
  /** shape @default 'rounded' */
  shape?: 'squared' | 'rounded' | 'circle'
  /** icon position relative to label @default 'left' */
  iconPosition?: 'left' | 'right'
  /** disable button */
  disabled?: boolean
  /** button label text */
  children?: string
  /** custom styles for root element */
  style?: any
  /** custom styles for icon */
  iconStyle?: any
  /** custom styles for label text */
  textStyle?: any
  /** custom styles for hover state */
  hoverStyle?: any
  /** custom styles for active state */
  activeStyle?: any
  /** onPress handler */
  onPress?: (event: any) => void | Promise<void>
}
export default function Button ({
  style,
  iconStyle,
  textStyle,
  children,
  color = 'secondary',
  variant = 'outlined',
  size = 'm',
  shape = 'rounded',
  icon,
  iconPosition = 'left',
  disabled,
  hoverStyle,
  activeStyle,
  onPress,
  ...props
}: ButtonProps) {
  return null
}
