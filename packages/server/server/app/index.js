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
      mode: options.mode || DEFAULT_MODE
    })
    res.status(200).send(html)
  }
}
