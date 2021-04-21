import _set from 'lodash/set'
import { DEFAULT_LAYOUT_NAME } from '../constants'
import defaultLayout from '../layouts/defaultLayout'

import _config from './config'

export default function initLayouts (layouts = {}) {
  for (let layoutName in layouts) {
    registerLayout(layoutName, layouts[layoutName])
  }

  if (!layouts[DEFAULT_LAYOUT_NAME]) {
    registerLayout(DEFAULT_LAYOUT_NAME, defaultLayout)
  }
}

export function registerLayout (name, layout) {
  if (_config.layouts && _config.layouts[name]) {
    throw new Error('[@startupjs/mail] registerLayouts: ' +
      `layout ${name} already registred`
    )
  }

  _set(_config, ['layouts', name], layout)
}

export function getLayout (name) {
  if (!name) {
    throw new Error(
      '[@startupjs/mail] getLayout: name parameter is required!'
    )
  }
  if (!_config.layouts[name]) {
    throw new Error(
      `[@startupjs/mail] getLayout: layout (${name}) does not exists!`
    )
  }
  return _config.layouts[name]
}
