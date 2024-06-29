import React from 'react'
import { axios, pug, styl, observer, BASE_URL, setSessionData, sub, $ } from 'startupjs'
import { Content, Span, Button, User, Card } from '@startupjs/ui'
import { openAuthSessionAsync, maybeCompleteAuthSession } from 'expo-web-browser'

const AUTH_URL = '/auth'
const AUTH_TOKEN_KEY = '__successAuthToken__'
const PROVIDERS = {
  // google: true,
  github: true
}

if (isSuccessPage()) maybeCompleteAuthSession(true)

export default observer(function Success () {
  const authUrls = useAuthUrls()
  const $user = sub($.users[$.session.userId.get()])

  if (isSuccessPage()) {
    return pug`
      Content(padding)
        Span Authorization successful
    `
  }

  if (!authUrls) {
    return pug`
      Content(padding)
        Span No auth urls found
    `
  }

  // TODO: remove console.logs
  async function handleAuth (provider) {
    const result = await openAuthSessionAsync(authUrls[provider], `${BASE_URL}${AUTH_URL}/login`)
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

  return pug`
    Content(padding gap full align='center' vAlign='center')
      if $user.get()
        Card.card
          User(
            avatarUrl=$user.avatarUrl.get()
            name=$user.name.get()
          )
      each provider in Object.keys(PROVIDERS)
        Button.button(
          key=provider
          onPress=() => handleAuth(provider)
        )= 'Login with ' + provider.charAt(0).toUpperCase() + provider.slice(1)
  `
  styl`
    .card
      padding-top 1u
      padding-bottom 1u
    .button
      width 30u
  `
})

function useAuthUrls () {
  const authUrls = getAuthUrls()
  if (authUrls instanceof Promise) throw authUrls
  return authUrls
}

const getAuthUrls = makeOnceFn(async () => {
  try {
    const res = await axios.post(`${BASE_URL}${AUTH_URL}/urls`, { providers: Object.keys(PROVIDERS) })
    const urls = res.data?.urls
    if (!urls) console.error('No auth urls found.\n' + (res.data?.error || ''))
    return urls
  } catch (err) {
    console.error('Failed to get auth urls:', err)
  }
})

function makeOnceFn (fn) {
  let promise, initialized, error, result
  return (...args) => {
    if (initialized) return result
    if (error) throw error
    if (promise) return promise
    promise = (async () => {
      try {
        result = await fn(...args)
        initialized = true
        return result
      } catch (err) {
        error = err
      } finally {
        promise = undefined
      }
    })()
    return promise
  }
}

function isSuccessPage () {
  return typeof window !== 'undefined' && window.location?.search?.includes(AUTH_TOKEN_KEY)
}
