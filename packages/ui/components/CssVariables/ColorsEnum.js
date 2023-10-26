const MainEnum = {
  primary: 'primary',
  secondary: 'secondary',
  error: 'error',
  success: 'success',
  warning: 'warning',
  info: 'info',
  attention: 'attention',
  special: 'special'
}

const BgEnum = {
  bg: 'bg',
  'bg-inverse': 'bg-inverse',
  'bg-inverse-alt': 'bg-inverse-alt',
  'bg-inverse-transparent': 'bg-inverse-transparent',
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
  'bg-primary-inverse': 'bg-primary-inverse',
  'bg-primary-dim': 'bg-primary-dim',
  'bg-primary-transparent': 'bg-primary-transparent',
  'bg-secondary-inverse': 'bg-secondary-inverse',
  'bg-error-inverse': 'bg-error-inverse',
  'bg-error-transparent': 'bg-error-transparent',
  'bg-success-inverse': 'bg-success-inverse',
  'bg-success-transparent': 'bg-success-transparent',
  'bg-warning-inverse': 'bg-warning-inverse',
  'bg-warning-transparent': 'bg-warning-transparent',
  'bg-info-inverse': 'bg-info-inverse',
  'bg-attention-inverse': 'bg-attention-inverse',
  'bg-special-inverse': 'bg-special-inverse'
}

const TextEnum = {
  text: 'text',
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
  'text-info-strong': 'text-info-strong',
  'text-on-color': 'text-on-color',
  'text-on-bg': 'text-on-bg',
  'text-on-bg-inverse': 'text-on-bg-inverse',
  'text-on-primary': 'text-on-primary',
  'text-on-secondary': 'text-on-secondary',
  'text-on-error': 'text-on-error',
  'text-on-success': 'text-on-success',
  'text-on-warning': 'text-on-warning',
  'text-on-info': 'text-on-info',
  'text-on-attention': 'text-on-attention',
  'text-on-special': 'text-on-special'
}

const BorderEnum = {
  border: 'border',
  'border-strong': 'border-strong',
  'border-primary': 'border-primary',
  'border-secondary': 'border-secondary',
  'border-error': 'border-error',
  'border-success': 'border-success',
  'border-warning': 'border-warning',
  'border-info': 'border-info',
  'border-attention': 'border-attention',
  'border-special': 'border-special',
  'border-inverse': 'border-inverse',
  'border-dim': 'border-dim',
  'border-strong-alt': 'border-strong-alt'
}

const ColorsEnum = {
  ...MainEnum,
  ...BgEnum,
  ...TextEnum,
  ...BorderEnum
}

export default ColorsEnum

export const ColorsEnumValues = Object.values(ColorsEnum)
