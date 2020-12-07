import { _layouts as layouts } from '../server/initLayouts'
import { defaultLayout } from '../layouts'

export default async function getDataFromLayout (model, layout, options) {
  if (!layout) return defaultLayout(options)
  const data = await layouts[layout](model, options)
  return data
}
