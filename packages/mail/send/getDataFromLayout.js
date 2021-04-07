import { _layouts as layouts } from '../server/initLayouts'
import { DEFAULT_LAYOUT_NAME } from '../constants'

export default async function getDataFromLayout (
  model,
  layout = DEFAULT_LAYOUT_NAME,
  options
) {
  const data = await layouts[layout](model, options)
  return data
}
