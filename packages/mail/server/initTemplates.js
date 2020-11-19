export let templates

export default function initTemplates (configTemplates) {
  if (templates) return
  templates = {...configTemplates}
}

export function registerTemplates (newTemplates) {
  for ( let templateName in newTemplates ) {
    if (templates[templateName]) {
      throw new Error('[@startupjs/mail] registerTemplates: ' +
        `tempate ${templateName} already registred`
      )
    }
    templates[templateName] = newTemplates[templateName]
  }
}
