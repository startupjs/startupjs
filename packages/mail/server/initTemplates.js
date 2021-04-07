export let _templates = {}

export default function initTemplates (templates = {}) {
  for (let templateName in templates) {
    registerTemplate(templateName, templates[templateName])
  }
}

export function registerTemplate (name, template) {
  if (_templates[name]) {
    throw new Error('[@startupjs/mail] registerTemplates: ' +
      `tempate ${name} already registred`
    )
  }

  _templates[name] = template
}
