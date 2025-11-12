import { Suspense, createElement as el } from 'react'
import { createPlugin } from '@startupjs/registry'
import axios from '@startupjs/utils/axios'
import isDevelopment from '@startupjs/utils/isDevelopment'
import { BASE_URL, setBaseUrl } from '@startupjs/utils/BASE_URL'
import { $ } from 'teamplay'
import connect from 'teamplay/connect'
import { v4 as uuid } from 'uuid'

const URL_SESSION = '/api/serverSession'

export default createPlugin({
  name: 'clientSession',
  order: 'system session',
  enabled () {
    const { enableServer, enableConnection, enableOAuth2 } = this.module.options
    return (enableServer || enableConnection) && !enableOAuth2
  },
  server: () => ({
    afterSession (expressApp) {
      expressApp.use((req, res, next) => {
        req.session.userId ??= uuid()
        next()
      })
    },
    api (expressApp) {
      expressApp.get(URL_SESSION, function (req, res) {
        const { userId, loggedIn } = req.session
        return res.json({ userId, loggedIn })
      })
    }
  }),
  client: (options, {
    module: {
      options: { baseUrl = BASE_URL, enableXhrFallback = true }
    }
  }) => {
    if (baseUrl !== BASE_URL) setBaseUrl(baseUrl)
    axios.defaults.baseURL = baseUrl
    return {
      renderRoot ({ children }) {
        return (
          el(Suspense, { fallback: null },
            el(SessionInitializer, {},
              el(ConnectionInitializer, { baseUrl, enableXhrFallback },
                children
              )
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
      const res = await axios.get(URL_SESSION)
      // TODO: handle errors like 500 etc.
      const session = res.data || {}
      if (typeof session !== 'object') throw Error('Invalid session data. Got: ' + JSON.stringify(session))
      if (!session.userId) throw Error('Invalid session data - missing userId. Got: ' + JSON.stringify(session))
      $.session.set(session)
      sessionInitialized = true
    } catch (err) {
      sessionError = new Error('[@startupjs] Error retrieving _session from server:\n' + err.message)
    } finally {
      sessionPromise = undefined
    }
  })()
  return sessionPromise
}

function ConnectionInitializer ({ baseUrl, enableXhrFallback, children }) {
  initConnection({ baseUrl, enableXhrFallback })
  return children
}

let connectionInitialized
function initConnection ({ baseUrl, enableXhrFallback }) {
  if (connectionInitialized) return
  connectionInitialized = true
  connect({
    baseUrl,
    // In dev we embed startupjs server as middleware into Metro server itself.
    // We have to use XHR since there is no way to easily access Metro's WebSocket endpoints.
    // In production we run our own server and can use WebSocket without any problems.
    forceXhrFallback: enableXhrFallback && isDevelopment
  })
}
