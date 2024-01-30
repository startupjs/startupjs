import dummyLoadConfig from '@startupjs/registry/loadStartupjsConfig.auto'
// - init connection to ShareDB server
// - setup baseUrl for axios
// - add rich-text support to ShareDB
import dummyInit from '@startupjs/init/client.auto'

;(_ => _)([dummyLoadConfig, dummyInit])

export default () => {}
