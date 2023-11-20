import init from 'startupjs/init/server.js'
import startupjsServer from 'startupjs/server.js'
import { initApp } from 'startupjs/app/server.js'
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

  ee.on('routes', expressApp => {
    expressApp.use('/api', api)
  })
})

function getHead () {
  return `
    <title>App</title>
    <!-- Put vendor JS and CSS here -->
  `
}

export default function run () {}
