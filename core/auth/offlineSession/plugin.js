import { Suspense, createElement as el } from 'react'
import { createPlugin } from '@startupjs/registry'
import axios from '@startupjs/utils/axios'
import { BASE_URL, setBaseUrl } from '@startupjs/utils/BASE_URL'
import { v4 as uuid } from 'uuid'
import { setSessionData, getSessionData } from '../client/sessionData'

export default createPlugin({
  name: 'offlineSession',
  order: 'system session',
  enabled () {
    const { enableServer, enableConnection, enableOffline = true } = this.module.options
    return (!enableServer && !enableConnection && enableOffline)
  },
  client: (options, {
    module: {
      options: { baseUrl = BASE_URL }
    }
  }) => {
    if (baseUrl !== BASE_URL) setBaseUrl(baseUrl)
    axios.defaults.baseURL = baseUrl
    return {
      renderRoot ({ children }) {
        return (
          el(Suspense, { fallback: null },
            el(SessionInitializer, {},
              children
            )
          )
        )
      }
    }
  }
})

function SessionInitializer ({ children }) {
  const sessionPromise = initSession()
  if (sessionPromise) throw sessionPromise
  return children
}

let sessionPromise, sessionInitialized, sessionError
function initSession () {
  if (sessionError) throw sessionError
  if (sessionInitialized) return
  if (sessionPromise) return sessionPromise
  sessionPromise = (async () => {
    try {
      // dynamically import to reduce bundle size when offlineSession is not used
      const { default: connectOffline } = await import('teamplay/connect-offline')
      await connectOffline()
      let session = await getSessionData({ requireToken: false })
      // set a dummy userId if none exists in the session
      session ??= { userId: uuid() }
      await setSessionData(session, { requireToken: false })
      sessionInitialized = true
    } catch (err) {
      sessionError = new Error('[@startupjs] Error initializing offline connection:\n' + err.message)
    } finally {
      sessionPromise = undefined
    }
  })()
  return sessionPromise
}
