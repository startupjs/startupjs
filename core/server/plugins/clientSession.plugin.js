import { Suspense, createElement as el } from 'react'
import { axios, $ } from 'startupjs'
import { createPlugin } from '@startupjs/registry'
import { v4 as uuid } from 'uuid'

export default createPlugin({
  name: 'clientSession',
  order: 'system session',
  enabled () {
    const { enableServer, enableConnection, enableOAuth2 } = this.module.options
    return (enableServer || enableConnection) && !enableOAuth2
  },
  server: () => ({
    afterSession (expressApp) {
      // userId
      expressApp.use((req, res, next) => {
        // TODO: change this to maybe set _session.userId again, but using $
        // const model = req.model
        // Set anonymous userId unless it was set by some end-user auth middleware
        if (req.session.userId == null) req.session.userId = uuid()
        // Set userId into model
        // model.set('_session.userId', req.session.userId)
        next()
      })
    },
    api (expressApp) {
      expressApp.get('/api/serverSession', function (req, res) {
        // TODO: reimplement restoreUrl functionality
        // const restoreUrl = req.session.restoreUrl
        // if (restoreUrl) {
        //   delete req.session.restoreUrl
        //   req.model.set('_session.restoreUrl', restoreUrl)
        // }
        const { userId, loggedIn } = req.session

        return res.json({ userId, loggedIn })
      })

      // expressApp.post('/api/restore-url', function (req, res) {
      //   const { restoreUrl } = req.body
      //   req.session.restoreUrl = restoreUrl
      //   res.sendStatus(200)
      // })
    }
  }),
  client: () => ({
    renderRoot ({ children }) {
      return (
        el(Suspense, { fallback: null },
          el(SessionInitializer, {}, children)
        )
      )
    }
  })
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
      const res = await axios.get('/api/serverSession')
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
