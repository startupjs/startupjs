import init from 'startupjs/init/server.js'
import startupjsServer from 'startupjs/server.js'
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
  initUi(ee, options)

  ee.on('routes', expressApp => {
    expressApp.use('/api', api)
  })
})

function getHead () {
  return `
    ${getUiHead()}
    <title>App</title>
    <!-- Put vendor JS and CSS here -->
  `
}

export default function run () {}
