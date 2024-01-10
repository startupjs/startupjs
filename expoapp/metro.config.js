const { getDefaultConfig } = require('startupjs/metro-config')
const { resolve } = require('path')
// const connect = require('connect')

const config = getDefaultConfig(__dirname)

config.watchFolders = [resolve(__dirname, '../')]
config.resolver.nodeModulesPaths = [
  resolve(__dirname, 'node_modules'),
  resolve(__dirname, '../node_modules')
]
// config.server.enhanceMiddleware = () => {
//   return connect()
//     .use('/test-api', (req, res) => {
//       res.end('Hello from Connect!\n')
//     })
// }

module.exports = config
