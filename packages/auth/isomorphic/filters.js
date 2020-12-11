import { SIGN_IN_URL } from './constants'

function isLoggedIn (signInPageUrl) {
  return function (model, next, redirect) {
    const loggedIn = model.get('_session.loggedIn')
    if (!loggedIn) return redirect(signInPageUrl || SIGN_IN_URL)
    next()
  }
}

export default {
  isLoggedIn
}
