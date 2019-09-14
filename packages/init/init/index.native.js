import { BASE_URL } from '@env'

// React Native requires manual configuration of the ShareDB client
import ShareDB from 'sharedb/lib/client'

// isomorphic ShareDB initialization
import commonInit from './common'

// BASE_URL must be specified, otherwise Native app doesn't know which server to connect to
if (!BASE_URL) {
  console.error(`
  !!!WARNING!!! No BASE_URL specified in .env

  Please read below how to fix:

  BASE_URL is not specified.
  Please create a file '.env.local' with BASE_URL of your machine/server:

  BASE_URL="http://YOUR_MACHINE_IP:3000"

  When developing locally, make sure YOUR_MACHINE_IP is not localhost but the actual IP address
  on your local network (like 192.168.0.100). Your smartphone should be connected to the same
  network as your machine. The native app will use YOUR_MACHINE_IP to connect to your local server.

  By default the server is configured to run on port 3000, so if you didn't change the PORT of the server, make
  sure to specify ':3000' in the BASE_URL.

  When running a production build, specify the proper BASE_URL in a '.env.production' file:

  BASE_URL="https://example.com"
  `)
}

// Make it behave like a browser to trick Racer
// https://github.com/derbyjs/racer/blob/master/lib/util.js#L3
process.title = 'browser'

// Polyfill process.nextTick
process.nextTick = process.nextTick || setImmediate

// Get configuration from BASE_URL env var
window.__racerHighwayClientOptions = {
  base: '/channel',
  reconnect: true,
  browserChannelOnly: false,
  srvProtocol: getProtocol(),
  srvHost: getHost(),
  srvPort: getPort(),
  srvSecurePort: getPort(),
  timeout: 10000,
  timeoutIncrement: 10000
}
function getHost () {
  return (BASE_URL.match(/\/\/([^/:]+)/) || [])[1] || 'localhost'
}
function getProtocol () {
  return /https:/.test(BASE_URL) ? 'https:' : 'http:'
}
function getPort () {
  let port = ~~(BASE_URL.match(/:(\d+)/) || [])[1]
  if (!port) {
    let protocol = getProtocol()
    port = protocol === 'https:' ? 443 : 80
  }
  return port
}

export default () => commonInit(ShareDB)
