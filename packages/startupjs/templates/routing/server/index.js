import init from 'startupjs/init'
import startupjsServer from 'startupjs/server'
import { initApp } from 'startupjs/app/server'
import orm from '../model'
import api from './api'
import getMainRoutes from '../main/routes'

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

  ee.on('routes', expressApp => {
    expressApp.use('/api', api)
  })
})

function getHead (appName) {
  return `
    <title>App</title>
    <!-- Put vendor JS and CSS here -->
  `
}

export default function run () {}
