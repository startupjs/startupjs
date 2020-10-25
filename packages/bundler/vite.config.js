// @ts-check
const reactPlugin = require('vite-plugin-react')
const startupjsPlugin = require('vite-plugin-startupjs')

/**
 * @type { import('vite').UserConfig }
 */
const config = {
  jsx: 'react',
  https: true,
  plugins: [startupjsPlugin, reactPlugin],
  alias: {},
  optimizeDeps: {
    include: [
      ...startupjsPlugin.optimizeDeps.include
    ],
    exclude: [
      ...startupjsPlugin.optimizeDeps.exclude
    ],
    link: [
    ]
  }
}

module.exports = config
