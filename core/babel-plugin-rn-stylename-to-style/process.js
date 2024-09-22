import { process as dynamicProcess } from 'react-native-dynamic-style-processor/src/index.js'
import { singletonMemoize } from 'teamplay/cache'
import dimensions from './dimensions.js'
import singletonVariables, { defaultVariables } from './variables.js'
import matcher from './matcher.js'

// TODO: Improve css variables performance. Instead of rerunning finding variables each time
//       it has to work as a pipeline and pass the variables from one step to the next.

const VARS_REGEX = /"var\(\s*(--[A-Za-z0-9_-]+)\s*,?\s*(.*?)\s*\)"/g
const VAR_NAMES_REGEX = /"var\(\s*--[A-Za-z0-9_-]+/g
const HAS_VAR_REGEX = /"var\(/

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
    if (hasVariables(fileStyles, globalStyles, localStyles)) {
      const variableNames = getVariableNames(fileStyles, globalStyles, localStyles)
      // trigger rerender when cache is used
      listenForVariablesChange(variableNames)
      // Return the variable values themselves to force
      // the affected cache to recalculate
      for (const variableName of variableNames) {
        args['VAR_' + variableName] = singletonVariables[variableName]
      }
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

function hasVariables (...styleObjects) {
  for (const styleObject of styleObjects) {
    if (_hasVariables(styleObject)) return true
  }
}

function _hasVariables (styles = {}) {
  return HAS_VAR_REGEX.test(JSON.stringify(styles))
}

function getVariableNames (...styleObjects) {
  let res = []
  for (const styleObject of styleObjects) {
    res = res.concat(_getVariableNames(styleObject))
  }
  res = [...new Set(res)].sort() // remove duplicates and sort
  return res
}

function _getVariableNames (styles = {}) {
  let res = JSON.stringify(styles).match(VAR_NAMES_REGEX) || []
  res = res.map(i => i.replace(/"var\(\s*/, ''))
  return res
}

function replaceVariables (styles = {}) {
  let strStyles = JSON.stringify(styles)
  strStyles = strStyles.replace(VARS_REGEX, (match, varName, varDefault) => {
    let res
    res = singletonVariables[varName] ?? defaultVariables[varName] ?? varDefault
    if (typeof res === 'string') {
      res = res.trim()
      // replace 'px' value with a pure number
      res = res.replace(/px$/, '')
      // sometimes compiler returns wrapped brackets. Remove them
      const bracketsCount = res.match(/^\(+/)?.[0]?.length || 0
      res = res.substring(bracketsCount, res.length - bracketsCount)
    }
    if (!isNumeric(res)) {
      res = `"${res}"`
    }
    return res
  })
  return JSON.parse(strStyles)
}

function transformStyles (styles) {
  if (styles) {
    // trigger rerender when cache is NOT used
    if (hasMedia(styles)) listenForDimensionsChange()

    // dynamically process @media queries and vh/vw units
    styles = dynamicProcess(styles)

    if (hasVariables(styles)) {
      // Dynamically process css variables.
      // This will also auto-trigger rerendering on variable change when cache is not used
      styles = replaceVariables(styles)
    }

    return styles
  } else {
    return {}
  }
}

// If @media is used, force trigger access to the observable value.
// `dimensions` is an observed Proxy so
// whenever its value changes the according components will
// automatically rerender.
// The change is triggered globally in startupjs/plugins/cssMediaUpdater.plugin.js
function listenForDimensionsChange () {
  // eslint-disable-next-line no-unused-expressions
  if (dimensions.width) true
}

// If var() is used, force trigger access to the observable value.
// `singletonVariables` is an observed Proxy so
// whenever its value changes the according components will
// automatically rerender.
function listenForVariablesChange (variables = []) {
  for (const variable of variables) {
    // eslint-disable-next-line no-unused-expressions
    if (singletonVariables[variable]) true
  }
}

// ref: https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0?permalink_comment_id=2694461#gistcomment-2694461
function simpleNumericHash (s) {
  for (var i = 0, h = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0
  return h
}

function isNumeric (num) {
  return (typeof num === 'number' || (typeof num === 'string' && num.trim() !== '')) && !isNaN(num)
}
