import callLoader from '@startupjs/bundler/lib/callLoader.js'
import stylusToCssLoader from '@startupjs/bundler/lib/stylusToCssLoader.js'
import cssToReactNativeLoader from '@startupjs/bundler/lib/cssToReactNativeLoader.js'

export default function viteTransformStartupjsStyl () {
  return {
    name: 'startupjs:styl',
    configResolved (config) {
      config.plugins = config.plugins.filter(plugin => {
        if (['vite:css', 'vite:css-post'].includes(plugin.name)) return
        return true
      })
    },
    async transform (code, filename) {
      if (!(
        /\.styl$/.test(filename) &&
        !/\.module\.styl/.test(filename)
      )) return
      code = callLoader(stylusToCssLoader, code, filename, { platform: 'web' })
      code = callLoader(cssToReactNativeLoader, code, filename)
      // transform from cjs to mjs format
      code = code.replace(/module\.exports\s*=\s*/, 'export default ')
      return {
        code,
        map: { mappings: '' }
      }
    }
  }
}
