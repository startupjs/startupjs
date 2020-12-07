export let _templates

export default function initTemplates (templates) {
  if (_templates) return
  _templates = { ...templates }
}

export function registerTemplates (templates) {
  for (let templateName in templates) {
    if (_templates[templateName]) {
      throw new Error('[@startupjs/mail] registerTemplates: ' +
        `tempate ${templateName} already registred`
      )
    }
    _templates[templateName] = templates[templateName]
  }
}
