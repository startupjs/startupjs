if (typeof window !== 'undefined') {
  console.log('◕◕◕ [client] setup racer highway connection ◕◕◕')
  window.__racerHighwayClientOptions = {
    base: '/channel',
    reconnect: true,
    browserChannelOnly: false,
    srvProtocol: 'ws:',
    srvHost: 'localhost',
    srvPort: process.env.PORT || 3000,
    srvSecurePort: undefined,
    timeout: 10000,
    timeoutIncrement: 10000
  }
}
