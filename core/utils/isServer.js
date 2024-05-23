let isServer = checkIsServer()

function checkIsServer () {
  if (typeof process === 'object' && process.__mockBrowser) {
    return false
  } else if (typeof Deno !== 'undefined' && Deno?.version?.deno) { // eslint-disable-line no-undef
    return true
  } else if (typeof process === 'object' && process.versions && process.versions.node) {
    return true
  }
}

export function setIsServer (value) {
  isServer = value
}

export default isServer
