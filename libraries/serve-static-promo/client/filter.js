import { PLUGIN_MODEL_PATH } from '../constants'

export default function redirectToPromoIfNotLoggedIn ({ redirectUrl = '/promo' } = {}) {
  return function redirectToPromoIfNotLoggedInFilter (model, next, redirect) {
    if (!model.scope(PLUGIN_MODEL_PATH).get('hasPromo')) return next()
    const loggedIn = model.scope().get('_session.loggedIn')
    const platform = model.scope().get('$system.platform')
    const isServer = !platform
    if (!loggedIn && (isServer || platform === 'web')) return redirect(redirectUrl)
    next()
  }
}
