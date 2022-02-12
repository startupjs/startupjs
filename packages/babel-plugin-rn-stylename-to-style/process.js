import { process as dynamicProcess } from 'react-native-dynamic-style-processor/src/index.js'
import dimensions from './dimensions.js'
import matcher from './matcher.js'

export function process (
  styleName,
  fileStyles,
  globalStyles,
  localStyles,
  inlineStyleProps
) {
  fileStyles = transformStyles(fileStyles)
  globalStyles = transformStyles(globalStyles)
  localStyles = transformStyles(localStyles)

  return matcher(
    styleName, fileStyles, globalStyles, localStyles, inlineStyleProps
  )
}

function hasMedia (styles) {
  for (const selector in styles) {
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
