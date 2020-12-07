import { _templates as templates } from '../server/initTemplates'

export default async function getDataFromTemplate (model, template, options) {
  const data = await templates[template](model, options)
  return data
}
