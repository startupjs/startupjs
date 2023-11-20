import config from 'startupjs/bundler/metro.config.js'
import path from 'path'

config.watchFolders = [
  path.resolve(__dirname, '../'),
  path.resolve(__dirname, '../node_modules')
]

export default config
