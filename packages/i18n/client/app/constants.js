import {
  faCheckCircle,
  faExclamationCircle,
  faHourglassHalf
} from '@fortawesome/free-solid-svg-icons'
import ICONS_STYLES from './icons.styl'

export const TRANSLATED_STATUS = 'translated'
export const UNTRANSLATED_STATUS = 'untranslated'
export const PENDING_STATE = 'pending'

export const FILTERS = [TRANSLATED_STATUS, UNTRANSLATED_STATUS, PENDING_STATE]

export const FILTERS_META = {
  [TRANSLATED_STATUS]: {
    style: ICONS_STYLES.translated,
    icon: faCheckCircle,
    label: 'translated'
  },
  [UNTRANSLATED_STATUS]: {
    style: ICONS_STYLES.untranslated,
    icon: faExclamationCircle,
    label: 'untranslated'
  },
  [PENDING_STATE]: {
    style: ICONS_STYLES.pending,
    icon: faHourglassHalf,
    label: 'pending to be saved'
  }
}
