const callLoader = require('@startupjs/bundler/lib/callLoader')
const cssToReactNativeLoader = require('@startupjs/bundler/lib/cssToReactNativeLoader')
const stylusToCssLoader = require('@startupjs/bundler/lib/stylusToCssLoader')
const { createFilter } = require('@rollup/pluginutils')
const fs = require('fs').promises

function transform (code, filename) {
  code = callLoader(stylusToCssLoader, code, filename, { platform: 'web' })
  code = callLoader(cssToReactNativeLoader, code, filename)
  code = code.replace(/module\.exports\s*=\s*/, 'export default ')
  return code
}

function rollupPlugin (options = {}) {
  const filter = createFilter(options.include, options.exclude)

  return {
    name: 'stylus-to-react-native-rollup-plugin',
    transform (content, id) {
      if (!/\.styl/.test(id)) return null
      if (!filter(id)) return null
      return {
        code: transform(content, id),
        map: { mappings: '' }
      }
    }
  }
}

module.exports = function stylusToReactNativePlugin (config, options) {
  config.packageOptions.rollup.plugins.push(
    rollupPlugin({ include: '**/node_modules/**' })
  )

  return {
    name: 'stylus-to-react-native-plugin',
    resolve: {
      input: ['.styl'],
      output: ['.js']
    },
    async load ({ filePath }) {
      const code = await fs.readFile(filePath, 'utf-8')
      return transform(code, filePath)
    }
  }
}
