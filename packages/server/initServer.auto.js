import dummyLoadConfig from '@startupjs/registry/loadStartupjsConfig.auto'
// - init connection to ShareDB server
// - setup baseUrl for axios
// - add rich-text support to ShareDB
import dummyInit from '@startupjs/init/server.auto'

export default () => {}

export function NO_DEAD_CODE_ELIMINATION () {
  return [dummyLoadConfig, dummyInit]
}
