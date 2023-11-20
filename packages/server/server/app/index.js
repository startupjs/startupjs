import fs from 'fs'
import defaultClientLayout from './defaultClientLayout.js'
import { getProductionStyles, getResourcePath } from './resourceManager.js'

const appName = 'main'
// `react-native` mode makes all root DOM elements fullscreen
// with flex-direction column and removes scroll (ScrollView has to be used).
// If you don't want this -- specify { mode: 'web' } in options.
const DEFAULT_MODE = 'react-native'

export default (options = {}) => {
  const getHead = options.getHead || (() => '')

  return function (req, res, next) {
    const html = (options.getClientLayout || defaultClientLayout)({
      head: getHead(req),
      styles: process.env.NODE_ENV === 'production' && options.mode === 'web'
        ? getProductionStyles(appName, options)
        : '',
      jsBundle: getResourcePath('bundle', appName, options),
      mode: options.mode || DEFAULT_MODE,
      fontsStyles: getFontsStyles() || ''
    })
    res.status(200).send(html)
  }
}

function getFontsStyles () {
  const FONTS_PATH = process.cwd() + '/public/fonts'
  const EXT_WISHLIST = ['eot', 'otf', 'ttf', 'woff', 'woff2']
  const FONTS_FORMAT = {
    'eot?#iefix': 'embedded-opentype',
    otf: 'opentype',
    ttf: 'truetype',
    woff: 'woff',
    woff2: 'woff2'
  }

  if (fs.existsSync(FONTS_PATH)) {
    let files = fs.readdirSync(FONTS_PATH)
    files = files.filter(file => EXT_WISHLIST.indexOf(file.split('.')[1]) !== -1)

    // parse files to format:
    // { fontName: ['ttf', 'otf'] }
    const data = files.reduce((acc, item) => {
      const [fileName, fileExt] = item.split('.')
      if (!acc[fileName]) acc[fileName] = []
      acc[fileName].push(fileExt)
      return acc
    }, {})

    return Object.keys(data).reduce((css, fileName) => {
      const srcs = data[fileName].reduce((acc, fileExt, index, arr) => {
        if (fileExt === 'eot') fileExt = 'eot?#iefix'
        acc += `url('/fonts/${fileName}.${fileExt}') format('${FONTS_FORMAT[fileExt]}')`

        if (index !== arr.length - 1) acc += ',\n'
        return acc
      }, '')

      css += `@font-face {
        font-family: ${fileName};
        src: url('/fonts/${fileName}.${data[fileName][0]}');
        src: ${srcs};
      }\n`

      return css
    }, '')
  }
}
