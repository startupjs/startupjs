export const BaseColors = {
  white: 'white',
  black: 'black',
  main: 'main',
  'bg-main': 'bg-main',
  'text-main': 'text-main',
  'border-main': 'border-main',
  primary: 'primary',
  secondary: 'secondary',
  error: 'error',
  success: 'success',
  warning: 'warning',
  info: 'info',
  attention: 'attention'
}

export const BgColors = {
  'bg-main': 'bg-main',
  'bg-primary': 'bg-primary',
  'bg-secondary': 'bg-secondary',
  'bg-success': 'bg-success',
  'bg-warning': 'bg-warning',
  'bg-attention': 'bg-attention',
  'bg-error': 'bg-error',
  'bg-info': 'bg-info',
  'bg-main-subtle': 'bg-main-subtle',
  'bg-main-strong': 'bg-main-strong',
  'bg-primary-strong': 'bg-primary-strong',
  'bg-primary-subtle': 'bg-primary-subtle',
  'bg-secondary-subtle': 'bg-secondary-subtle',
  'bg-secondary-strong': 'bg-secondary-strong',
  'bg-success-subtle': 'bg-success-subtle',
  'bg-success-strong': 'bg-success-strong',
  'bg-warning-subtle': 'bg-warning-subtle',
  'bg-warning-strong': 'bg-warning-strong',
  'bg-attention-subtle': 'bg-attention-subtle',
  'bg-attention-strong': 'bg-attention-strong',
  'bg-error-subtle': 'bg-error-subtle',
  'bg-error-strong': 'bg-error-strong'
}

export const TextColors = {
  'text-description': 'text-description',
  'text-placeholder': 'text-placeholder',
  'text-primary': 'text-primary',
  'text-secondary': 'text-secondary',
  'text-error': 'text-error',
  'text-success': 'text-success',
  'text-warning': 'text-warning',
  'text-attention': 'text-attention'
}

export const TextOnColors = {}

export const BorderColors = {
  'border-primary': 'border-primary',
  'border-secondary': 'border-secondary',
  'border-error': 'border-error',
  'border-success': 'border-success',
  'border-warning': 'border-warning',
  'border-attention': 'border-attention'
}

export const ShadowColors = {
  'shadow-main': 'shadow-main',
  'shadow-main-strong': 'shadow-main-strong',
  'shadow-main-subtle': 'shadow-main-subtle'
}

export const ComponentColors = {
  '--AutoSuggest-itemBg': '--AutoSuggest-itemBg',
  '--Carousel-arrowWrapperBg': '--Carousel-arrowWrapperBg',
  '--Div-hoverBg': '--Div-hoverBg',
  '--Div-activeBg': '--Div-activeBg',
  '--Div-tooltipBg': '--Div-tooltipBg',
  '--Div-tooltipText': '--Div-tooltipText',
  '--Modal-overlayBg': '--Modal-overlayBg',
  '--Checkbox-switchBg': '--Checkbox-switchBg',
  '--Checkbox-switchBulletBg': '--Checkbox-switchBulletBg',
  '--Range-labelBg': '--Range-labelBg',
  '--Range-labelText': '--Range-labelText'
}

const Colors = {
  ...BaseColors,
  ...BgColors,
  ...TextColors,
  // ...TextOnColors,
  ...BorderColors,
  ...ShadowColors,
  ...ComponentColors
}

export default Colors

export const ColorValues = Object.values(Colors)
