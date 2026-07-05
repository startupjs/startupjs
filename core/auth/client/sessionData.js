import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from '@startupjs/utils/axios'
import { BASE_URL } from '@startupjs/utils/BASE_URL'
import { $ } from 'teamplay'
import { emitInitSession } from './sessionEmitter.js'

export const SESSION_KEY = 'startupjs.session'

// The session token is attached through a request interceptor scoped to our
// own server's origin -- NOT through a global
// `axios.defaults.headers.common.Authorization` -- so that requests the app
// makes to OTHER hosts through the shared axios instance can never leak the
// session JWT (the jwt IS the session, leaking it is full session theft).
let authToken

axios.interceptors.request.use(config => {
  if (!authToken) return config
  if (!targetsOwnServer(config)) return config
  const headers = config.headers || (config.headers = {})
  // an explicitly passed Authorization header always wins
  if (typeof headers.has === 'function'
    ? headers.has('Authorization')
    : (headers.Authorization ?? headers.authorization) != null) return config
  if (typeof headers.set === 'function') headers.set('Authorization', 'Bearer ' + authToken)
  else headers.Authorization = 'Bearer ' + authToken
  return config
})

// whether the request targets our own server (the base url the session plugin
// set on the shared axios instance). Relative urls resolve against it, so they
// are ours; absolute urls (or a per-request baseURL) must match its origin
function targetsOwnServer (config) {
  try {
    const own = new URL(axios.defaults.baseURL || BASE_URL)
    const url = new URL(config.url ?? '', config.baseURL || own)
    return url.origin === own.origin
  } catch {
    return false
  }
}

export async function getSessionData ({ requireToken = true } = {}) {
  let session = await AsyncStorage.getItem(SESSION_KEY)
  session = session != null ? JSON.parse(session) : undefined
  try { validateSession(session, { requireToken }) } catch { session = undefined }
  return session
}

export async function setSessionData (session, { silent = false, requireToken = true } = {}) {
  validateSession(session, { requireToken })
  const oldSessionString = await AsyncStorage.getItem(SESSION_KEY)
  const newSessionString = JSON.stringify(session)
  if (newSessionString !== oldSessionString) await AsyncStorage.setItem(SESSION_KEY, newSessionString)
  if (silent) return
  for (const key in session) $.session[key].set(session[key])
  if (requireToken) {
    authToken = session.token
  }
  await emitInitSession(session)
}

export async function deleteSessionData () {
  authToken = undefined
  await AsyncStorage.removeItem(SESSION_KEY)
}

function validateSession (session, { requireToken = true } = {}) {
  if (!session) throw Error(ERRORS.jwtNoSession(session))
  if (!session.userId) throw Error(ERRORS.jwtNoUserId(session))
  if (requireToken && !session.token) throw Error(ERRORS.jwtNoToken(session))
}

const ERRORS = {
  jwtNoSession: session => `
    Invalid jwt session request.
    Did not get session data from server.
    Got: ${JSON.stringify(session)}
  `,
  jwtNoUserId: session => `
    Invalid jwt session request. Missing userId.
    Got: ${JSON.stringify(session)}
  `,
  jwtNoToken: session => `
    Invalid jwt session request. Missing token.
    Got: ${JSON.stringify(session)}
  `
}
