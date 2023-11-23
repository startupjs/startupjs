import init from 'startupjs/init/server.js'
import startupjsServer from 'startupjs/server.js'
import { initApp } from 'startupjs/app/server.js'
import { initI18n } from 'startupjs/i18n/server.js'
import { getUiHead, initUi } from '@startupjs/ui/server/index.js'
import orm from '../model/index.js'
import api from './api/index.js'

// Init startupjs ORM.
init({ orm })

// Check '@startupjs/server' readme for the full API
startupjsServer({
  secure: false, // TODO: https://github.com/startupjs/startupjs#security
  getHead
}, (ee, options) => {
  initApp(ee)
  initUi(ee, options)
  initI18n(ee)

  ee.on('routes', expressApp => {
    expressApp.use('/api', api)
  })
})

function getHead () {
  return `
    ${getUiHead()}
    <title>HelloWorld</title>
    <!-- Put vendor JS and CSS here -->
  `
}

export default function run () {}
