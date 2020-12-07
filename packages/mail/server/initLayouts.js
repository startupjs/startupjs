export let _layouts

export default function initLayouts (layouts) {
  if (_layouts) return
  _layouts = { ...layouts }
}

export function registerLayouts (layouts) {
  for (let layoutName in layouts) {
    if (_layouts[layoutName]) {
      throw new Error('[@startupjs/mail] registerLayouts: ' +
        `layout ${layoutName} already registred`
      )
    }
    _layouts[layoutName] = layouts[layoutName]
  }
}
