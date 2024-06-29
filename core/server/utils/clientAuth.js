import { Platform } from 'react-native'
import { axios, BASE_URL, setSessionData } from 'startupjs'
import openAuthSessionAsync from '@startupjs/utils/openAuthSessionAsync'
import { AUTH_URL, AUTH_TOKEN_KEY } from './constants.js'

export default async function auth (provider) {
  if (!provider) throw Error('No provider specified')
  const res = await axios.post(`${BASE_URL}${AUTH_URL}/urls`, { providers: [provider] })
  const authUrl = res.data?.urls?.[provider]
  if (!authUrl) throw Error('No auth url received for provider ' + provider)
  if (Platform.OS === 'web') {
    const state = encodeURIComponent(JSON.stringify({ platform: 'web', redirectUrl: window.location.href }))
    window.location.href = authUrl + `&state=${state}`
    await new Promise(resolve => setTimeout(resolve, 30000))
    return
  }
  const result = await openAuthSessionAsync(authUrl, `${BASE_URL}${AUTH_URL}/finish`)
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
