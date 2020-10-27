import passport from 'passport'
import {
  LINKEDIN_WEB_LOGIN_URL,
  CALLBACK_NATIVE_LINKEDIN_URL,
  CALLBACK_LINKEDIN_URL,
  FAILURE_LOGIN_URL
} from '../isomorphic'
import {
  loginWeb,
  loginNative
} from './api'
import { finishAuth, ensureAuthState } from '@startupjs/auth/server'

export default function (opts) {
  const { router, config } = opts

  // Web routes
  router.get(LINKEDIN_WEB_LOGIN_URL, loginWeb)

  router.get(
    CALLBACK_LINKEDIN_URL,
    passport.authenticate('linkedin', { failureRedirect: FAILURE_LOGIN_URL }),
    ensureAuthState,
    finishAuth
  )
  //

  // Native routes
  router.get(
    CALLBACK_NATIVE_LINKEDIN_URL,
    (req, res, next) => loginNative(req, res, next, config),
    ensureAuthState,
    finishAuth
  )
  //
}
