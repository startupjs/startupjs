let initialized = false
function init () {
  if (initialized) return
  mockBrowser()
  initialized = true
}

function mockBrowser () {
  // simulate that we are on the client
  if (typeof window === 'undefined') global.window = {}
  process.title = 'browser'
  process.nextTick = process.nextTick || (typeof setImmediate !== 'undefined' && setImmediate) || (fn => setTimeout(fn, 0))
}

init()
