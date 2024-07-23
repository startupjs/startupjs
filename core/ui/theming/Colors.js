export const BaseColors = {
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
  'bg-main-subtle': 'bg-main-subtle',
  'bg-main-subtle-alt': 'bg-main-subtle-alt',
  'bg-main-strong': 'bg-main-strong',
  'bg-primary': 'bg-primary',
  'bg-secondary': 'bg-secondary',
  'bg-error': 'bg-error',
  'bg-success': 'bg-success',
  'bg-warning': 'bg-warning',
  'bg-info': 'bg-info',
  'bg-attention': 'bg-attention',
  'bg-primary-strong': 'bg-primary-strong',
  'bg-primary-subtle': 'bg-primary-subtle',
  'bg-primary-transparent': 'bg-primary-transparent',
  'bg-secondary-subtle': 'bg-secondary-subtle',
  'bg-error-transparent': 'bg-error-transparent',
  'bg-success-transparent': 'bg-success-transparent',
  'bg-warning-transparent': 'bg-warning-transparent'
}

export const TextColors = {
  'text-description': 'text-description',
  'text-placeholder': 'text-placeholder',
  'text-subtle': 'text-subtle',
  'text-primary': 'text-primary',
  'text-secondary': 'text-secondary',
  'text-error': 'text-error',
  'text-success': 'text-success',
  'text-warning': 'text-warning',
  'text-info': 'text-info',
  'text-attention': 'text-attention',
  'text-success-strong': 'text-success-strong',
  'text-info-strong': 'text-info-strong'
}

export const TextOnColors = {
  'text-on-color': 'text-on-color',
  'text-on-primary': 'text-on-primary',
  'text-on-secondary': 'text-on-secondary',
  'text-on-error': 'text-on-error',
  'text-on-success': 'text-on-success',
  'text-on-warning': 'text-on-warning',
  'text-on-info': 'text-on-info',
  'text-on-attention': 'text-on-attention'
}

export const BorderColors = {
  'border-main-strong': 'border-main-strong',
  'border-main-strong-alt': 'border-main-strong-alt',
  'border-main-subtle': 'border-main-subtle',
  'border-primary': 'border-primary',
  'border-secondary': 'border-secondary',
  'border-error': 'border-error',
  'border-success': 'border-success',
  'border-warning': 'border-warning',
  'border-info': 'border-info',
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
  '--Checkbox-switchBg': '--Checkbox-switchBg',
  '--Checkbox-switchBulletBg': '--Checkbox-switchBulletBg',
  '--Checkbox-switchBulletBg-checked': '--Checkbox-switchBulletBg-checked',
  '--Div-hoverBg': '--Div-hoverBg',
  '--Div-activeBg': '--Div-activeBg',
  '--Div-tooltipBg': '--Div-tooltipBg',
  '--Div-tooltipText': '--Div-tooltipText',
  '--Modal-overlayBg': '--Modal-overlayBg',
  '--InputWrapper-label-color': '--InputWrapper-label-color',
  '--Range-labelBg': '--Range-labelBg',
  '--Range-labelText': '--Range-labelText',
  '--TextInput-text-color': '--TextInput-text-color'
}

const Colors = {
  ...BaseColors,
  ...BgColors,
  ...TextColors,
  ...TextOnColors,
  ...BorderColors,
  ...ShadowColors,
  ...ComponentColors
}

export default Colors

export const ColorValues = Object.values(Colors)
