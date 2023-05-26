import init from 'startupjs/init'
import startupjsServer from 'startupjs/server'
import { initApp } from 'startupjs/app/server'
import { initI18n, getI18nRoutes } from 'startupjs/i18n/server'
import { getUiHead, initUi } from '@startupjs/ui/server'
import orm from '../model'
import api from './api'
import getMainRoutes from '../main/routes'

// Init startupjs ORM.
init({ orm })

// Check '@startupjs/server' readme for the full API
startupjsServer({
  secure: false, // TODO: https://github.com/startupjs/startupjs#security
  getHead,
  appRoutes: [
    ...getMainRoutes(),
    ...getI18nRoutes()
  ]
}, (ee, options) => {
  initApp(ee)
  initUi(ee, options)
  initI18n(ee)

  ee.on('routes', expressApp => {
    expressApp.use('/api', api)
  })
})

function getHead (appName) {
  return `
    ${getUiHead()}
    <title>HelloWorld</title>
    <!-- Put vendor JS and CSS here -->
  `
}

export default function run () {}
