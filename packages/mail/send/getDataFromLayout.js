import _config from '../server/config'
import { DEFAULT_LAYOUT_NAME } from '../constants'

export default async function getDataFromLayout (
  model,
  layout = DEFAULT_LAYOUT_NAME,
  options
) {
  const data = await _config.layouts[layout](model, options)
  return data
}
