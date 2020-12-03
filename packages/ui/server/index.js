import { getReactDatepickerHead, initReactDatepicker } from '../components/forms/DateTimePicker/initReactDatepickerStyles'

export function getUiHead () {
  return `${getReactDatepickerHead()}`
}

export function initUi (ee, options) {
  initReactDatepicker(ee, options)
}
