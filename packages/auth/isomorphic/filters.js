import { SIGN_IN_URL } from './constants'

function isLoggedIn (signInPageUrl) {
  return function (model, next, redirect) {
    const loggedIn = model.get('_session.loggedIn')
    if (!loggedIn) return redirect(signInPageUrl || SIGN_IN_URL)
    next()
  }
}

function isNotLoggedIn (redirectUrl = '/') {
  return function (model, next, redirect) {
    const loggedIn = model.get('_session.loggedIn')

    const _redirectUrl = redirectUrl ||
      model.get('_session.auth.successRedirectUrl') ||
      '/'

    if (loggedIn) return redirect(_redirectUrl)
    next()
  }
}

export default {
  isLoggedIn,
  isNotLoggedIn
}
