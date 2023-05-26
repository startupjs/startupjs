import callLoader from '@startupjs/bundler/lib/callLoader.js'
import replaceObserverLoader from '@startupjs/bundler/lib/replaceObserverLoader.js'

export default function viteTransformStartupjsStyl () {
  return {
    name: 'startupjs:observer',
    enforce: 'pre',
    async transform (code, filename) {
      if (!/\.[mc]?jsx?$/.test(filename)) return
      code = callLoader(replaceObserverLoader, code, filename)
      return {
        code,
        map: { mappings: '' }
      }
    }
  }
}
