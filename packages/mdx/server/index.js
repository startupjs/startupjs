import pugClassnames from '@startupjs/babel-plugin-react-pug-classnames'
import styleNameToStyle from '@startupjs/babel-plugin-rn-stylename-to-style'
import styleNameInline from '@startupjs/babel-plugin-rn-stylename-inline'
import pugToReact from 'babel-plugin-transform-react-pug'
import { transform } from '@babel/core'
// import replaceObserverLoader from '@startupjs/bundler/lib/replaceObserverLoader'
// import webPassClassnamePlugin from 'babel-plugin-react-native-web-pass-classname'

import ace from '!raw-loader!ace-builds/src-noconflict/ace.js' /* eslint-disable-line */
import themeChrome from '!raw-loader!ace-builds/src-noconflict/theme-chrome' /* eslint-disable-line */
import modeJade from '!raw-loader!ace-builds/src-noconflict/mode-jade.js' /* eslint-disable-line */
import modeStylus from '!raw-loader!ace-builds/src-noconflict/mode-stylus.js' /* eslint-disable-line */
import modeJavascript from '!raw-loader!ace-builds/src-noconflict/mode-javascript.js' /* eslint-disable-line */
import modeStartupjs from '!raw-loader!@startupjs/mdx/client/Example/helpers/mode-startupjs.js' /* eslint-disable-line */
import modeText from '!raw-loader!ace-builds/src-noconflict/mode-text.js' /* eslint-disable-line */

export default function initMdx (ee) {
  ee.on('routes', expressApp => {
    expressApp.post('/api/code-parse', function (req, res) {
      try {
        const { code } = req.body

        const tcode = transform(code, {
          presets: ['@babel/env', '@babel/react'],
          plugins: [
            [pugToReact, { classAttribute: 'styleName' }],
            [pugClassnames, { classAttribute: 'styleName' }],
            [styleNameToStyle, { extensions: ['styl', 'css'] }],
            [styleNameInline, { platform: 'web' }],
            '@babel/plugin-proposal-class-properties'
          ],
          comments: false
        }).code

        res.send({ code: tcode, error: '' })
      } catch (err) {
        res.send({ code: '', error: err.message })
      }
    })

    expressApp.get('/api/get-deps-string', (req, res) => {
      const depsString = `
        ${ace}
        \n\n${themeChrome}
        \n\n${modeJade}
        \n\n${modeStylus}
        \n\n${modeJavascript}
        \n\n${modeStartupjs}
        \n\n${modeText}
      `
      res.send(depsString)
    })
  })
}
