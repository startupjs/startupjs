export const BaseColors = {
  bg: 'bg',
  text: 'text',
  border: 'border',
  contrast: 'contrast',
  primary: 'primary',
  secondary: 'secondary',
  error: 'error',
  success: 'success',
  warning: 'warning',
  info: 'info',
  attention: 'attention',
  special: 'special'
}

export const BgColors = {
  'bg-contrast': 'bg-contrast',
  'bg-contrast-alt': 'bg-contrast-alt',
  'bg-contrast-transparent': 'bg-contrast-transparent',
  'bg-primary': 'bg-primary',
  'bg-secondary': 'bg-secondary',
  'bg-error': 'bg-error',
  'bg-success': 'bg-success',
  'bg-warning': 'bg-warning',
  'bg-info': 'bg-info',
  'bg-attention': 'bg-attention',
  'bg-special': 'bg-special',
  'bg-dim': 'bg-dim',
  'bg-dim-alt': 'bg-dim-alt',
  'bg-strong': 'bg-strong',
  'bg-primary-contrast': 'bg-primary-contrast',
  'bg-primary-dim': 'bg-primary-dim',
  'bg-primary-transparent': 'bg-primary-transparent',
  'bg-secondary-contrast': 'bg-secondary-contrast',
  'bg-error-contrast': 'bg-error-contrast',
  'bg-error-transparent': 'bg-error-transparent',
  'bg-success-contrast': 'bg-success-contrast',
  'bg-success-transparent': 'bg-success-transparent',
  'bg-warning-contrast': 'bg-warning-contrast',
  'bg-warning-transparent': 'bg-warning-transparent',
  'bg-info-contrast': 'bg-info-contrast',
  'bg-attention-contrast': 'bg-attention-contrast',
  'bg-special-contrast': 'bg-special-contrast'
}

export const TextColors = {
  'text-description': 'text-description',
  'text-placeholder': 'text-placeholder',
  'text-primary': 'text-primary',
  'text-secondary': 'text-secondary',
  'text-error': 'text-error',
  'text-success': 'text-success',
  'text-warning': 'text-warning',
  'text-info': 'text-info',
  'text-attention': 'text-attention',
  'text-special': 'text-special',
  'text-success-strong': 'text-success-strong',
  'text-info-strong': 'text-info-strong'
}

export const TextOnColors = {
  'text-on-color': 'text-on-color',
  'text-on-contrast': 'text-on-contrast',
  'text-on-primary': 'text-on-primary',
  'text-on-secondary': 'text-on-secondary',
  'text-on-error': 'text-on-error',
  'text-on-success': 'text-on-success',
  'text-on-warning': 'text-on-warning',
  'text-on-info': 'text-on-info',
  'text-on-attention': 'text-on-attention',
  'text-on-special': 'text-on-special'
}

export const BorderColors = {
  'border-strong': 'border-strong',
  'border-dim': 'border-dim',
  'border-primary': 'border-primary',
  'border-secondary': 'border-secondary',
  'border-error': 'border-error',
  'border-success': 'border-success',
  'border-warning': 'border-warning',
  'border-info': 'border-info',
  'border-attention': 'border-attention',
  'border-special': 'border-special',
  'border-contrast': 'border-contrast',
  'border-strong-alt': 'border-strong-alt'
}

export const ShadowColors = {
  shadow: 'shadow',
  'shadow-strong': 'shadow-strong',
  'shadow-dim': 'shadow-dim'
}

const Colors = {
  ...BaseColors,
  ...BgColors,
  ...TextColors,
  ...TextOnColors,
  ...BorderColors,
  ...ShadowColors
}

export default Colors

export const ColorValues = Object.values(Colors)
