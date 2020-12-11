import { _layouts as layouts } from '../server/initLayouts'
import { DEFAULT_LAYOUT_NAME } from '../constants'
// import defaultLayout from '../layouts/defaultLayout'

export default async function getDataFromLayout (
  model,
  layout = DEFAULT_LAYOUT_NAME,
  options
) {
  const data = await layouts[layout].layout(model, options)
  return data
}
