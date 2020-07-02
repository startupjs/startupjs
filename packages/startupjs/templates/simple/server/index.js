import init from 'startupjs/init'
import orm from '../model'
import startupjsServer from 'startupjs/server'
import api from './api'

// Init startupjs ORM.
init({ orm })

// Check '@startupjs/server' readme for the full API
startupjsServer({ getHead }, ee => {
  ee.on('routes', expressApp => {
    expressApp.use('/api', api)
  })
})

function getHead (appName) {
  return `
    <title>HelloWorld</title>
    <!-- Put vendor JS and CSS here -->
  `
}

export default function run () {}
