import {
  faCheckCircle,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons'
import ICONS_STYLES from './icons.styl'

// types
export const NO_TYPE = 'all'
export const TRANSLATED_TYPE = 'translated'
export const UNTRANSLATED_TYPE = 'untranslated'
export const DISPLAYED_TRANSLATION_TYPES = [
  TRANSLATED_TYPE,
  UNTRANSLATED_TYPE
]

console.log(ICONS_STYLES, 'ICONS_STYLES')
export const TRANSLATION_TYPES_META = {
  [TRANSLATED_TYPE]: {
    label: 'translated',
    icon: faCheckCircle,
    iconStyle: ICONS_STYLES.translated
  },
  [UNTRANSLATED_TYPE]: {
    label: 'untranslated',
    icon: faExclamationCircle,
    iconStyle: ICONS_STYLES.untranslated
  }
}

// filters
export const PENDING_FILTER = 'pending'
export const DISPLAYED_TRANSLATION_FILTERS = [
  { label: 'Pending', value: PENDING_FILTER }
]
