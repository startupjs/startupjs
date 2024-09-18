import { Platform } from 'react-native'
import { axios, BASE_URL, setSessionData } from 'startupjs'
import { getPlugin } from '@startupjs/registry'
import openAuthSessionAsync from '@startupjs/utils/openAuthSessionAsync'
import getLinkingUri from '@startupjs/utils/getLinkingUri'
import { router } from 'expo-router'
import { reload } from './reload.js'
import {
  AUTH_TOKEN_KEY,
  AUTH_GET_URL,
  AUTH_PLUGIN_NAME,
  AUTH_URL,
  AUTH_LOCAL_PROVIDER,
  AUTH_FORCE_PROVIDER,
  AUTH_2FA_PROVIDER
} from './constants.js'

export default async function login (provider, { extraScopes, redirectUrl, handleError, ...props } = {}) {
  if (!provider) throw new Error('No provider specified')
  const plugin = getPlugin(AUTH_PLUGIN_NAME)
  if (!plugin.enabled) {
    throw new Error(`Plugin ${AUTH_PLUGIN_NAME} hasn't been enabled`)
  }
  redirectUrl ??= plugin.optionsByEnv.client?.redirectUrl
  if (provider === AUTH_LOCAL_PROVIDER) return await localLogin({ redirectUrl, ...props })
  if (provider === AUTH_FORCE_PROVIDER) return await forceLogin({ redirectUrl, ...props })
  if (provider === AUTH_2FA_PROVIDER) return await twoFALogin({ redirectUrl, ...props })
  const res = await axios.post(`${BASE_URL}${AUTH_GET_URL}`, { provider, extraScopes })
  let authUrl = res.data?.url
  if (!authUrl) {
    throw new Error(`
      No auth url received for provider ${provider}
      URL: ${BASE_URL}${AUTH_GET_URL}
      Received: ${JSON.stringify(res.data)}
    `)
  }

  // add state to later track what to do after auth
  const state = {}
  if (Platform.OS === 'web') {
    Object.assign(state, {
      platform: 'web',
      redirectUrl: redirectUrl || '/'
    })
  } else {
    Object.assign(state, {
      platform: 'mobile',
      redirectUrl: getLinkingUri()
    })
  }
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
  const result = await openAuthSessionAsync(authUrl, getLinkingUri())
  if (result.type === 'success' && result.url) {
    console.log('Auth result:', result)
    const urlParams = new URLSearchParams(new URL(result.url).search)
    let error = urlParams.get('err')

    if (error) {
      error = JSON.parse(error)
      if (handleError) return handleError(error)

      if (error.redirectUrl) {
        router.push(error.redirectUrl)
        return
      } else {
        return console.error(error.message)
      }
    }

    let session = urlParams.get(AUTH_TOKEN_KEY)
    if (!session) return console.error('Session data was not received')
    session = JSON.parse(session)
    await setSessionData(session, { silent: true })
    console.log('Auth success:', session)
    await new Promise(resolve => setTimeout(resolve, 500))
    try { await reload(redirectUrl) } catch (err) {}
  } else {
    console.error('Auth failed:', result)
  }
}

async function localLogin ({ redirectUrl, register, ...userinfo } = {}) {
  let url
  if (register) {
    url = `${BASE_URL}${AUTH_URL}/${AUTH_LOCAL_PROVIDER}/register`
  } else {
    url = `${BASE_URL}${AUTH_URL}/${AUTH_LOCAL_PROVIDER}/login`
  }
  const res = await axios.post(url, userinfo)
  const { session, error } = res.data || {}

  if (error) {
    if (error.redirectUrl) {
      router.push(error.redirectUrl)
      return
    } else {
      throw new Error(error.message)
    }
  }

  if (!session) throw Error('Auth failed (no session data received). Please try again later')
  // TODO: show full screen loading page while setting session data (in StartupjsProvider),
  //       wait for a bit, like 500ms, then set the session data, wait another 500ms and navigate
  await setSessionData(session, { silent: true })
  console.log('Auth success:', session)
  await hardRedirect(redirectUrl)
}

async function forceLogin ({ redirectUrl, userId }) {
  const url = `${BASE_URL}${AUTH_URL}/${AUTH_FORCE_PROVIDER}/login`
  if (!userId) throw Error('No userId specified')
  const res = await axios.post(url, { userId })
  const { session, error } = res.data || {}

  if (error) {
    if (error.redirectUrl) {
      router.push(error.redirectUrl)
      return
    } else {
      throw new Error(error.message)
    }
  }

  if (!session) throw Error('Force auth failed (no session data received). Something went wrong')
  await setSessionData(session, { silent: true })
  console.log('Auth success:', session)
  await hardRedirect(redirectUrl)
}

async function twoFALogin ({ redirectUrl, secret, code }) {
  if (!secret) throw Error('No secret specified')
  if (!code) throw Error('No code specified')

  const url = `${BASE_URL}${AUTH_URL}/${AUTH_2FA_PROVIDER}/login`

  const res = await axios.post(url, { secret, code })
  const { session, error } = res.data || {}

  if (error) {
    if (error.redirectUrl) {
      router.push(error.redirectUrl)
      return
    } else {
      throw new Error(error.message)
    }
  }

  if (!session) throw new Error('Two-factor auth failed (no session data received). Something went wrong')
  await setSessionData(session, { silent: true })
  console.log('Auth success:', session)
  await hardRedirect(redirectUrl)
}

async function hardRedirect (redirectUrl) {
  if (Platform.OS === 'web') {
    window.location.href = redirectUrl || '/'
    await new Promise(resolve => setTimeout(resolve, 30000))
  } else {
    await new Promise(resolve => setTimeout(resolve, 500))
    try { await reload(redirectUrl) } catch (err) {}
  }
}
