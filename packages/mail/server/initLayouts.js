export let layouts

export default function initLayouts (configLayouts) {
  if (layouts) return
  layouts = { ...configLayouts }
}

export function registerLayouts (newLayouts) {
  for (let layoutName in newLayouts) {
    if (layouts[layoutName]) {
      throw new Error('[@startupjs/mail] registerLayouts: ' +
        `layout ${layoutName} already registred`
      )
    }
    layouts[layoutName] = newLayouts[layoutName]
  }
}
