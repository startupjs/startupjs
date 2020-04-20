const fs = require('fs')
const path = require('path')
const defaultStyles = fs.readFileSync(path.join(__dirname, 'defaultStyles.css'), 'utf8')
const rnwPolyfill = fs.readFileSync(path.join(__dirname, 'reactNativeWeb.css'), 'utf8')

module.exports = ({ head, styles, env, modelBundle, jsBundle, mode }) => `
<html>
  <head>
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    ${head || ''}
    <style>${defaultStyles}${mode === 'react-native' ? rnwPolyfill : ''}</style>
    ${styles || ''}
    <script>window.env = ${JSON.stringify(env)}</script>
  </head>
  <body>
    <div id='app'></div>
    <script type='application/json' id='bundle'>${JSON.stringify(modelBundle)}</script>
    <script defer src='${jsBundle}'></script>
  </body>
</html>
`
