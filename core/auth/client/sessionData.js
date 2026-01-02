import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from '@startupjs/utils/axios'
import { $ } from 'teamplay'
import { emitInitSession } from './sessionEmitter.js'

export const SESSION_KEY = 'startupjs.session'

export async function getSessionData ({ requireToken = true } = {}) {
  let session = await AsyncStorage.getItem(SESSION_KEY)
  session = session != null ? JSON.parse(session) : undefined
  try { validateSession(session, { requireToken }) } catch (err) { session = undefined }
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
    axios.defaults.headers.common.Authorization = 'Bearer ' + session.token
  }
  await emitInitSession(session)
}

export async function deleteSessionData () {
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
