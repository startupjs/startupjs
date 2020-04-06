import init from 'startupjs/init'
import orm from '../model'
import startupjsServer from 'startupjs/server'
import getMainRoutes from '../main/routes'

// Init startupjs ORM.
init({ orm })

// Check '@startupjs/server' readme for the full API
startupjsServer({
  getHead,
  appRoutes: [
    ...getMainRoutes()
  ]
})

function getHead (appName) {
  return `
    <title>StartupJS UI</title>
    <!-- Put vendor JS and CSS here -->
  `
}
