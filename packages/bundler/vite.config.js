// @ts-check
const startupjsPlugin = require('vite-plugin-startupjs')
const reactPlugin = require('vite-plugin-startupjs/react')

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
