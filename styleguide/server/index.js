import init from 'startupjs/init/server'
import orm from '../model'
import startupjsServer from 'startupjs/server'
import getMainRoutes from '../main/routes'
import getDocsRoutes from '@startupjs/docs/routes'
import { initApp } from 'startupjs/app/server'

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
  initApp(ee)
})

function getHead (appName) {
  return `
    <title>StartupJS UI</title>
    <!-- Put vendor JS and CSS here -->
  `
}

export default function run () {}
