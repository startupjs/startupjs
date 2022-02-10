import { process as dynamicProcess } from 'react-native-dynamic-style-processor/src/index.js'
import dimensions from './dimensions.js'
import matcher from './matcher.js'

export function process (
  styleName,
  cssStyles,
  globalStyles,
  localStyles,
  inlineStyleProps,

  jsxId,
  styleStates,
  setStyleStates
) {
  cssStyles = transformStyles(cssStyles)
  globalStyles = transformStyles(globalStyles)
  localStyles = transformStyles(localStyles)

  return matcher(
    styleName,
    cssStyles,
    globalStyles,
    localStyles,
    inlineStyleProps,

    jsxId,
    styleStates,
    setStyleStates
  )
}

function hasMedia (cssStyles) {
  for (const selector in cssStyles) {
    if (/^@media/.test(selector)) {
      return true
    }
  }
}

function transformStyles (styles) {
  if (styles) {
    // If @media is used, force trigger access to the observable value.
    // Whenever that value changes the according components will
    // automatically rerender.
    // The change is triggered globally using the useMediaChange() hook
    // in @startupjs/app, which sets up the Dimensions 'change' listener
    // eslint-disable-next-line no-unused-expressions
    if (hasMedia(styles)) dimensions.width

    // dynamically process @media queries and vh/vw units
    return dynamicProcess(styles)
  } else {
    return {}
  }
}
