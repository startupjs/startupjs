import { initApp } from '@startupjs/app/server'
import { getReactDatepickerHead, initReactDatepicker } from '../components/forms/DateTimePicker/initReactDatepickerStyles'

export function getUiHead () {
  return `${getReactDatepickerHead()}`
}

export function initUi (ee, options) {
  initApp(ee)
  initReactDatepicker(ee, options)
}
