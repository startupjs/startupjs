import reactPugClassNames from '@startupjs/babel-plugin-react-pug-classnames'
import styleNameToStyle from '@startupjs/babel-plugin-rn-stylename-to-style'
import styleNameInline from '@startupjs/babel-plugin-rn-stylename-inline'
import importToReactLazy from '@startupjs/babel-plugin-import-to-react-lazy'
import dotenv from '@startupjs/babel-plugin-dotenv'
import reactPug from 'babel-plugin-transform-react-pug'
import react from '@vitejs/plugin-react'

// TODO: Refactor to use babel-preset-startupjs

export default function viteTransformStartupjsJs (options) {
  const plugin = react({
    babel: {
      plugins: [
        [dotenv, {
          moduleName: '@env',
          path: ['.env', '.env.local']
        }],
        [reactPug, {
          classAttribute: 'styleName'
        }],
        [reactPugClassNames, {
          classAttribute: 'styleName'
        }],
        [styleNameToStyle, {
          extensions: ['styl', 'css'],
          useImport: true
        }],
        [styleNameInline, {
          platform: 'web'
        }],
        [importToReactLazy]
      ]
    },
    ...options
  })
  plugin.name = 'startupjs:js'
  return plugin
}
