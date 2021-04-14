import _config from '../server/config'

export default async function getDataFromTemplate (model, template, options) {
  const data = await _config.templates[template](model, options)
  return data
}
