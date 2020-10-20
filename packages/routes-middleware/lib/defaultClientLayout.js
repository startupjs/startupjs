const fs = require('fs')
const path = require('path')
const defaultStyles = fs.readFileSync(path.join(__dirname, 'defaultStyles.css'), 'utf8')
const rnwPolyfill = fs.readFileSync(path.join(__dirname, 'reactNativeWeb.css'), 'utf8')

const INDEX_FILE_PATH = path.join(process.cwd(), 'index.html')

module.exports = getClientLayoutFn()

function getClientLayoutFn () {
  if (fs.existsSync(INDEX_FILE_PATH)) {
    return getIndexLayoutFn(fs.readFileSync(INDEX_FILE_PATH, 'utf-8'))
  } else {
    return getDefaultLayout
  }
}

// TODO: Remove modelBundle. We don't need it anymore since we get _session
//       through a direct ajax call now in @startupjs/app
// TODO: Remove env. It's passed as _session.env now.
function getDefaultLayout ({ head, styles, env, modelBundle, jsBundle, mode, styleFonts }) {
  return /* html */`
    <html>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        ${head || ''}
        <style>${defaultStyles}${mode === 'react-native' ? rnwPolyfill : ''}</style>
        ${styles || ''}
        <script>window.env = ${JSON.stringify(env)}</script>
        <style>${styleFonts}</style>
      </head>
      <body>
        <div id='app'></div>
        <script type='application/json' id='bundle'>${JSON.stringify(modelBundle)}</script>
        <script defer src='${jsBundle}'></script>
      </body>
    </html>
  `
}

function getIndexLayoutFn (html) {
  const headEnd = '</head>'
  const [beforeHeadEnd, afterHeadEnd] = html.split(headEnd)
  if (!(beforeHeadEnd && afterHeadEnd)) throw new Error('</head> wasn\'t found in index.html')

  return ({ head = '', styles = '', jsBundle, styleFonts }) => {
    let _beforeHeadEnd = beforeHeadEnd
    let _afterHeadEnd = afterHeadEnd
    // If dynamic head already specifies <title>, remove the static one
    if (/<title>/.test(head)) {
      _beforeHeadEnd = _beforeHeadEnd.replace(/<title>.*<\/title>/, '')
    }
    _afterHeadEnd = replaceJsBundle(_afterHeadEnd, jsBundle)
    return _beforeHeadEnd +
      head +
      '<style>' + defaultStyles + '</style>' +
      '<style>' + styleFonts + '</style>' +
      styles +
      headEnd +
      _afterHeadEnd
  }
}

const BUNDLE_REGEX = /(?:type=['"]module['"]\s+)src=['"]\.?\/?index(?:\.web)\.js['"]/

function replaceJsBundle (html, jsBundle) {
  return html.replace(BUNDLE_REGEX, `defer src='${jsBundle}'`)
}
