export default (baseUrl) => {
  window.__racerHighwayClientOptions = {
    base: '/channel',
    reconnect: true,
    browserChannelOnly: false,
    srvProtocol: getProtocol(baseUrl),
    srvHost: getHost(baseUrl),
    srvPort: getPort(baseUrl),
    srvSecurePort: getPort(baseUrl),
    timeout: 10000,
    timeoutIncrement: 10000
  }
}

function getHost (baseUrl) {
  return (baseUrl.match(/\/\/([^/:]+)/) || [])[1] || 'localhost'
}

function getProtocol (baseUrl) {
  return /https:/.test(baseUrl) ? 'https:' : 'http:'
}

function getPort (baseUrl) {
  let port = ~~(baseUrl.match(/:(\d+)/) || [])[1]
  if (!port) {
    let protocol = getProtocol(baseUrl)
    port = protocol === 'https:' ? 443 : 80
  }
  return port
}
