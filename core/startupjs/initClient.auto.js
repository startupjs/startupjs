import isServer from '@startupjs/utils/isServer'
import init from './initClient.js'

if (!isServer) init()

export default () => {}
