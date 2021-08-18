
// import { replaceObserverLoader }
import pugClassnames from '@startupjs/babel-plugin-react-pug-classnames'
import styleNameToStyle from '@startupjs/babel-plugin-rn-stylename-to-style'
import styleNameInline from '@startupjs/babel-plugin-rn-stylename-inline'
import pugToReact from 'babel-plugin-transform-react-pug'
import { transform } from '@babel/standalone'
// import webPassClassnamePlugin from 'babel-plugin-react-native-web-pass-classname'

export default function initMdx (ee) {
  ee.on('routes', expressApp => {
    expressApp.post('/api/code-parse', function (req, res) {
      const { code } = req.body

      const tcode = transform(code, {
        presets: ['es2015', 'react'],
        plugins: [
          [pugToReact, { classAttribute: 'styleName' }],
          [pugClassnames, { classAttribute: 'styleName' }],
          [styleNameToStyle, { extensions: ['styl', 'css'] }],
          [styleNameInline, { platform: 'web' }]
          // webPassClassnamePlugin
        ],
        comments: false
      }).code

      res.send(tcode)
    })
  })
}
