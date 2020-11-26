import { SIGN_IN_URL } from './constants'

function isLoggedIn (signInUrl) {
  return function (model, next, redirect) {
    const loggedIn = model.get('_session.loggedIn')
    if (!loggedIn) return redirect(signInUrl || SIGN_IN_URL)
    next()
  }
}

export default {
  isLoggedIn
}
