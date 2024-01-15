import isServer from './isServer.js'

// ShareDB and Racer client distributions rely on Browserify's check for
// detecting whether they run in the browser environment or no.
// We have to mock this check in order to make them work in React Native and in Webpack.
// It's important to make sure that this mock is called before any calls to ShareDB or Racer on the client.
mockBrowserify()

// we should ignore this mock if it gets executed accidentally on the server,
// since ShareDB and Racer on the server behave differently
export default function mockBrowserify (force) {
  if (!force && isServer) return

  // https://github.com/derbyjs/racer/blob/master/lib/util.js#L3
  process.title = 'browser'

  // Polyfill process.nextTick
  process.nextTick = process.nextTick || (typeof setImmediate !== 'undefined' && setImmediate) || (fn => setTimeout(fn, 0))
}
