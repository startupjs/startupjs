import { DEFAULT_LAYOUT_NAME } from '../constants'
import defaultLayout from '../layouts/defaultLayout'

export let _layouts = {}

// latouts: {
//   layoutName: {
//     layout: function,
//     getLayoutVars: (model, userId, params) - возвращает по юзерам
//     getLayoutGeneralVars: (model, params) - возвращает общие и это более второстепенно так как тут чел должен понимать четко че будет
//   }
// }

export default function initLayouts (layouts = {}) {
  for (let layoutName in layouts) {
    registerLayout(layoutName, layouts[layoutName])
  }

  if (!layouts[DEFAULT_LAYOUT_NAME]) {
    registerLayout(DEFAULT_LAYOUT_NAME, defaultLayout)
  }
}

export function registerLayout (name, layout) {
  if (_layouts[name]) {
    throw new Error('[@startupjs/mail] registerLayouts: ' +
      `layout ${name} already registred`
    )
  }

  _layouts[name] = layout
}

export function getLayout (name) {
  if (!name) {
    throw new Error(
      '[@startupjs/mail] getLayout: name parameter is required!'
    )
  }
  if (!_layouts[name]) {
    throw new Error(
      `[@startupjs/mail] getLayout: layout (${name}) does not exists!`
    )
  }
  return _layouts[name]
}
