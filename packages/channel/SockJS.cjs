const transportList = [
  // 'xhr-polling' is the only transport which reliably works with Metro Server
  require('sockjs-client/lib/transport/xhr-polling')
]
module.exports = require('sockjs-client/lib/main.js')(transportList)
