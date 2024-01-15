const transportList = [
  require('sockjs-client/lib/transport/xhr-polling') // xhr-streaming
]
module.exports = require('sockjs-client/lib/main.js')(transportList)
