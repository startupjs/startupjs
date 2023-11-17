import url from 'url'
import path from 'path'
import fs from 'fs'

const dirname = path.dirname(url.fileURLToPath(import.meta.url))
const defaultStyles = fs.readFileSync(path.join(dirname, 'defaultStyles.css'), 'utf8')
const rnwPolyfill = fs.readFileSync(path.join(dirname, 'reactNativeWeb.css'), 'utf8')
const INDEX_FILE_PATH = path.join(process.cwd(), 'index.html')

export default getClientLayoutFn()

function getClientLayoutFn () {
  if (fs.existsSync(INDEX_FILE_PATH)) {
    return getIndexLayoutFn(fs.readFileSync(INDEX_FILE_PATH, 'utf-8'))
  } else {
    return getDefaultLayout
  }
}

function getDefaultLayout ({ head, styles, jsBundle, mode, fontsStyles }) {
  return /* html */`
    <html>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        ${head || ''}
        <style>${defaultStyles}${mode === 'react-native' ? rnwPolyfill : ''}</style>
        ${styles || ''}
        <style>${fontsStyles}</style>
      </head>
      <body>
        <div id='app'></div>
        <script defer src='${jsBundle}'></script>
      </body>
    </html>
  `
}

function getIndexLayoutFn (html) {
  const headEnd = '</head>'
  const [beforeHeadEnd, afterHeadEnd] = html.split(headEnd)
  if (!(beforeHeadEnd && afterHeadEnd)) throw new Error('</head> wasn\'t found in index.html')

  return ({ head = '', styles = '', jsBundle, fontsStyles }) => {
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
      '<style>' + fontsStyles + '</style>' +
      styles +
      headEnd +
      _afterHeadEnd
  }
}

const BUNDLE_REGEX = /(?:type=['"]module['"]\s+)src=['"]\.?\/?index(?:\.web)\.js['"]/

function replaceJsBundle (html, jsBundle) {
  return html.replace(BUNDLE_REGEX, `defer src='${jsBundle}'`)
}
