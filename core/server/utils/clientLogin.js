import { Platform } from 'react-native'
import { axios, BASE_URL, setSessionData } from 'startupjs'
import openAuthSessionAsync from '@startupjs/utils/openAuthSessionAsync'
import { AUTH_TOKEN_KEY, AUTH_GET_URL, AUTH_FINISH_URL } from './constants.js'

export default async function login (provider, { extraScopes } = {}) {
  if (!provider) throw Error('No provider specified')
  const res = await axios.post(`${BASE_URL}${AUTH_GET_URL}`, { provider, extraScopes })
  let authUrl = res.data?.url
  if (!authUrl) throw Error('No auth url received for provider ' + provider)

  // add state to later track what to do after auth
  const state = {}
  if (Platform.OS === 'web') Object.assign(state, { platform: 'web', redirectUrl: window.location.href })
  // add scopes to state to later understand what operations are permitted with the issued token
  const urlParams = new URLSearchParams(authUrl.split('?')[1])
  state.scopes = urlParams.get('scope').split(' ')
  // update authUrl to include state
  authUrl = authUrl + `&state=${encodeURIComponent(JSON.stringify(state))}`
  console.log('Auth url:', authUrl)

  if (Platform.OS === 'web') {
    window.location.href = authUrl
    await new Promise(resolve => setTimeout(resolve, 30000))
    return
  }
  const result = await openAuthSessionAsync(authUrl, `${BASE_URL}${AUTH_FINISH_URL}`)
  if (result.type === 'success' && result.url) {
    console.log('Auth result:', result)
    const urlParams = new URLSearchParams(new URL(result.url).search)
    let session = urlParams.get(AUTH_TOKEN_KEY)
    if (!session) return console.error('Session data was not received')
    session = JSON.parse(session)
    await setSessionData(session)
    console.log('Auth success:', session)
  } else {
    console.error('Auth failed:', result)
  }
}
