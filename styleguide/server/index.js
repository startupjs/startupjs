import init from 'startupjs/init/server'
import startupjsServer from 'startupjs/server'
import { initApp } from 'startupjs/app/server'
import getDocsRoutes from '@startupjs/docs/routes'
import { CRITICAL_VERSION } from '../config.json'
import orm from '../model'
import getMainRoutes from '../main/routes'

// Init startupjs ORM.
init({ orm })

// Check '@startupjs/server' readme for the full API
startupjsServer({
  getHead,
  appRoutes: [
    ...getMainRoutes(),
    ...getDocsRoutes()
  ]
}, (ee, options) => {
  ee.on('backend', async backend => {
    initApp(backend, CRITICAL_VERSION)
  })
  ee.on('routes', expressApp => {
    expressApp.get('/api/serverSession', function (req, res) {
      return res.json(req.model.get('_session'))
    })
  })
})

function getHead (appName) {
  return `
    <title>StartupJS UI</title>
    <!-- Put vendor JS and CSS here -->
  `
}

export default function run () {}
