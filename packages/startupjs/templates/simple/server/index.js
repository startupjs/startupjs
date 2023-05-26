import init from 'startupjs/init'
import startupjsServer from 'startupjs/server'
import orm from '../model'
import api from './api'

// Init startupjs ORM.
init({ orm })

// Check '@startupjs/server' readme for the full API
startupjsServer({
  secure: false, // TODO: https://github.com/startupjs/startupjs#security
  getHead
}, ee => {
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
