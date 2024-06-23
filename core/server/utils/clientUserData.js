import AsyncStorage from '@react-native-async-storage/async-storage'
import { axios, $ } from 'startupjs'

const USER_KEY = 'startupjs.user'

export async function getUserData () {
  let user = await AsyncStorage.getItem(USER_KEY)
  user = user != null ? JSON.parse(user) : undefined
  try { validateUser(user) } catch (err) { user = undefined }
  return user
}

export async function setUserData (user) {
  validateUser(user)
  const oldUserString = await AsyncStorage.getItem(USER_KEY)
  const newUserString = JSON.stringify(user)
  if (newUserString !== oldUserString) await AsyncStorage.setItem(USER_KEY, newUserString)
  for (const key in user) $.session[key].set(user[key])
  axios.defaults.headers.common.Authorization = 'Bearer ' + user.token
  await emitInitUser(user)
}

function validateUser (user) {
  if (!user) throw Error(ERRORS.jwtNoUserinfo(user))
  if (!user.userId) throw Error(ERRORS.jwtNoUserId(user))
  if (!user.token) throw Error(ERRORS.jwtNoToken(user))
}

const onInitUserHandlers = new Set()
export function onInitUser (cb) { onInitUserHandlers.add(cb) }
async function emitInitUser (user) {
  for (const handler of onInitUserHandlers) {
    const promise = handler(user)
    if (promise?.then) await promise
  }
}

const ERRORS = {
  jwtNoUserinfo: userinfo => `Invalid jwt request. Did not get user info from server. Got: ${JSON.stringify(userinfo)}`,
  jwtNoUserId: userinfo => `Invalid jwt request. Missing userId. Got: ${JSON.stringify(userinfo)}`,
  jwtNoToken: userinfo => `Invalid jwt request. Missing token. Got: ${JSON.stringify(userinfo)}`
}
