const callLoader = require('@startupjs/bundler/lib/callLoader')
const cssToReactNativeLoader = require('@startupjs/bundler/lib/cssToReactNativeLoader')
const { createFilter } = require('@rollup/pluginutils')
const fs = require('fs').promises

function transform (code, filename) {
  code = callLoader(cssToReactNativeLoader, code, filename)
  code = code.replace(/module\.exports\s*=\s*/, 'export default ')
  return code
}

function rollupPlugin (options = {}) {
  const filter = createFilter(options.include, options.exclude)

  return {
    name: 'css-to-react-native-rollup-plugin',
    transform (content, id) {
      if (!/\.css/.test(id)) return null
      if (!filter(id)) return null
      return {
        code: transform(content, id),
        map: { mappings: '' }
      }
    }
  }
}

module.exports = function cssToReactNativePlugin (config, options) {
  config.packageOptions.rollup.plugins.push(
    rollupPlugin({ include: '**/node_modules/**' })
  )

  return {
    name: 'css-to-react-native-plugin',
    resolve: {
      input: ['.css'],
      output: ['.js']
    },
    async load ({ filePath }) {
      const code = await fs.readFile(filePath, 'utf-8')
      return transform(code, filePath)
    }
  }
}
