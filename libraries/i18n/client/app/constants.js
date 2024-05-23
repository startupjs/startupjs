import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle'
import { faHourglassHalf } from '@fortawesome/free-solid-svg-icons/faHourglassHalf'
import ICONS_STYLES from './icons.styl'

export const TRANSLATED_STATE = 'translated'
export const UNTRANSLATED_STATE = 'untranslated'
export const PENDING_STATUS = 'pending'

export const FILTERS = [TRANSLATED_STATE, UNTRANSLATED_STATE, PENDING_STATUS]

export const FILTERS_META = {
  [TRANSLATED_STATE]: {
    style: ICONS_STYLES.translated,
    icon: faCheckCircle,
    label: 'translated'
  },
  [UNTRANSLATED_STATE]: {
    style: ICONS_STYLES.untranslated,
    icon: faExclamationCircle,
    label: 'untranslated'
  },
  [PENDING_STATUS]: {
    style: ICONS_STYLES.pending,
    icon: faHourglassHalf,
    label: 'pending to be saved'
  }
}
