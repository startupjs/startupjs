import getLayoutVars from './getLayoutVars'
// import getTemplateVars from './getTemplateVars'

export default async function getVars (model, options) {
  const layoutVars = await getLayoutVars(model, options)
  const templateVars = {}// await getTemplateVars(model, options)
  return { ...layoutVars, ...templateVars }
}
