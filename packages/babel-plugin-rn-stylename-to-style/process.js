import { process as dynamicProcess } from 'react-native-dynamic-style-processor/src/index.js'
import { singletonMemoize } from '@startupjs/cache'
import dimensions from './dimensions.js'
import matcher from './matcher.js'

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
  // IMPORTANT: This should be the same as the ones which go into the singletonMemoize function
  normalizer: (styleName, fileStyles, globalStyles, localStyles, inlineStyleProps) => simpleNumericHash(JSON.stringify([
    styleName,
    fileStyles?.__hash__ || fileStyles,
    globalStyles?.__hash__ || globalStyles,
    localStyles?.__hash__ || localStyles,
    inlineStyleProps
  ])),
  // IMPORTANT: This should be the same as the ones which go into the singletonMemoize function
  forceUpdateWhenChanged: (styleName, fileStyles, globalStyles, localStyles, inlineStyleProps) => {
    const args = {}
    const watchWidthChange = hasMedia(fileStyles) || hasMedia(globalStyles) || hasMedia(localStyles)
    if (watchWidthChange) {
      // trigger rerender when cache is used
      listenForDimensionsChange()
      // Return the dimensionsWidth value itself to force
      // the affected cache to recalculate
      args.dimensionsWidth = dimensions.width
    }
    return simpleNumericHash(JSON.stringify(args))
  }
})

function hasMedia (styles = {}) {
  for (const selector in styles) {
    if (/^@media/.test(selector)) {
      return true
    }
  }
}

function transformStyles (styles) {
  if (styles) {
    // trigger rerender when cache is NOT used
    if (hasMedia(styles)) listenForDimensionsChange()

    // dynamically process @media queries and vh/vw units
    return dynamicProcess(styles)
  } else {
    return {}
  }
}

// If @media is used, force trigger access to the observable value.
// `dimensions` is an observed Proxy so
// whenever its value changes the according components will
// automatically rerender.
// The change is triggered globally using the useMediaUpdate() hook
// in @startupjs/app, which sets up the Dimensions 'change' listener
function listenForDimensionsChange () {
  // eslint-disable-next-line no-unused-expressions
  if (dimensions.width) true
}

// ref: https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0?permalink_comment_id=2694461#gistcomment-2694461
function simpleNumericHash (s) {
  for (var i = 0, h = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0
  return h
}
