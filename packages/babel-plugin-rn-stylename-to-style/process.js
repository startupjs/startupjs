import { process as dynamicProcess } from 'react-native-dynamic-style-processor/src'
import dimensions from './dimensions'
import matcher from './matcher'

export function process (tagName, styleName, cssStyles, inlineStyles) {
  // If @media is used, force trigger access to the observable value.
  // Whenever that value changes the according components will
  // automatically rerender.
  // The change is triggered globally using the useMediaChange() hook
  // in @startupjs/app, which sets up the Dimensions 'change' listener
  // eslint-disable-next-line no-unused-expressions
  if (hasMedia(cssStyles)) dimensions.width

  cssStyles = dynamicProcess(cssStyles)

  return matcher(tagName, styleName, cssStyles, inlineStyles)
}

function hasMedia (cssStyles) {
  for (const selector in cssStyles) {
    if (/^@media/.test(selector)) {
      return true
    }
  }
}
