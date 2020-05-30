import init from 'startupjs/init'
import orm from '../model'
import startupjsServer from 'startupjs/server'
import api from './api'
import getMainRoutes from '../main/routes'
import { initApp } from 'startupjs/app/server'

// Init startupjs ORM.
init({ orm })

// Check '@startupjs/server' readme for the full API
startupjsServer({
  getHead,
  appRoutes: [
    ...getMainRoutes()
  ]
}, (ee, options) => {
  initApp(ee)
})

function getHead (appName) {
  return `
    <title>HelloWorld</title>
    <!-- Put vendor JS and CSS here -->
  `
}
