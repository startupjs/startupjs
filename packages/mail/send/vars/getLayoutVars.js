import { getLayout } from '../../server/initLayouts'
import { DEFAULT_LAYOUT_NAME, LAYOUT_VARS_PREFIX } from '../../constants'
import prefixVars from './prefixVars'

export default async function getLayoutVars (model, options) {
  const { recipientIds, layout: layoutName } = options
  const layout = getLayout(layoutName || DEFAULT_LAYOUT_NAME)
  const { getLayoutVars: _getLayoutVars, getLayoutGeneralVars } = layout

  let layoutGeneralVars = {}

  if (getLayoutGeneralVars) {
    prefixVars(LAYOUT_VARS_PREFIX, {
      ...await getLayoutGeneralVars(model, options)
    })
  }

  let layoutVars = {}

  if (_getLayoutVars && recipientIds.length) {
    const $auths = model.query('auths', { _id: { $in: recipientIds } })
    await $auths.fetch()
    let promises = []
    let i = 0
    for (let userId of recipientIds) {
      promises.push((async () => {
        const email = model.scope(`auths.${userId}.email`).get()
        const userVars = await _getLayoutVars(model, userId, options)
        layoutVars[email] = prefixVars(LAYOUT_VARS_PREFIX, userVars)
      })())

      i++
      if (!(i % 10)) {
        await Promise.all(promises)
        promises = []
      }
    }
    await Promise.all(promises)
    promises = []
    $auths.unfetch()
  }

  return { ...layoutGeneralVars, ...layoutVars }
}
