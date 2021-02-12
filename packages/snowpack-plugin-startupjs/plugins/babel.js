// const callLoader = require('@startupjs/bundler/lib/callLoader')
// const replaceObserverLoader = require('@startupjs/bundler/lib/replaceObserverLoader')
const babel = require('@babel/core')
const { createFilter } = require('@rollup/pluginutils')
// const fs = require('fs').promises

function rollupPlugin (options = {}) {
  const filter = createFilter(options.include, options.exclude)

  return {
    name: 'startupjs-babel-rollup-plugin',
    transform (content, id) {
      if (!/\.(web\.js|web\.jsx|web\.ts|web\.tsx|web\.mjs|js|jsx|ts|tsx|mjs)/.test(id)) return null
      if (!filter(id)) return null
      process.env.ASYNC = true
      // process.env.BABEL_ENV = 'development'
      if (!process.env.SNOWPACK_WEB) process.env.SNOWPACK_WEB = true
      // content = babel.transformFileSync(id, {
      // plugins: [require('@babel/plugin-transform-react-jsx')],
      // presets: [require('babel-preset-startupjs')]
      // }).code
      content = babel.transformSync(content, { filename: id }).code
      return {
        code: content,
        map: { mappings: '' }
      }
    }
  }
}

module.exports = function (config, options) {
  config.packageOptions.rollup.plugins.push(
    rollupPlugin({
      include: [
        // '**/node_modules/**'
        '**/node_modules/@startupjs/**',
        '**/node_modules/startupjs/**'
      ]
    })
  )

  return {
    name: 'my-babel-plugin',
    resolve: {
      input: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.web.mjs', '.js', '.jsx', '.ts', '.tsx', '.mjs'],
      output: ['.js']
    },
    async load ({ filePath }) {
      // Hack to turn on snowpack config after rollup is done
      if (!process.env.SNOWPACK_WEB) process.env.SNOWPACK_WEB = true
      // let code = await fs.readFile(filePath, 'utf-8')
      // code = callLoader(replaceObserverLoader, code, filePath)
      // code = await babel.transformAsync(code, { filename: filePath }).code
      // return code
      let code = await babel.transformFileAsync(filePath).code
      // code = callLoader(replaceObserverLoader, code, filePath)
      return code
    }
  }
}
