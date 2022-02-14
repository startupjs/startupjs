import { process as dynamicProcess } from 'react-native-dynamic-style-processor/src/index.js'
import { singletonMemoize } from '@startupjs/cache'
import dimensions from './dimensions.js'
import matcher from './matcher.js'

// IMPORTANT:
//   The args of this function affect the cache setup in @startupjs/react-sharedb-util/cache/styles.js
//   So if you change it then you also have to change the cache there.
export const process = singletonMemoize(function _process (
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
}, {
  cacheName: 'styles',
  normalizer: (styleName, fileStyles, globalStyles, localStyles, inlineStyleProps) => simpleNumericHash(JSON.stringify([
    styleName,
    fileStyles?.__hash__ || fileStyles,
    globalStyles?.__hash__ || globalStyles,
    localStyles?.__hash__ || localStyles,
    inlineStyleProps
  ]))
})

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

// ref: https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0?permalink_comment_id=2694461#gistcomment-2694461
function simpleNumericHash (s) {
  for (var i = 0, h = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0
  return h
}
