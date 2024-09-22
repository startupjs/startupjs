import { SIGN_IN_URL } from './../../isomorphic/constants'

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

    if (loggedIn) return redirect(redirectUrl)
    next()
  }
}

export default {
  isLoggedIn,
  isNotLoggedIn
}
