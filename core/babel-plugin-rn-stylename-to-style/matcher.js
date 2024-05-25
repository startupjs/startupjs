const ROOT_STYLE_PROP_NAME = 'style'
const PART_REGEX = /::?part\(([^)]+)\)/

const isArray = Array.isArray || function (arg) {
  return Object.prototype.toString.call(arg) === '[object Array]'
}

export default function matcher (
  styleName,
  fileStyles,
  globalStyles,
  localStyles,
  inlineStyleProps
) {
  // inlineStyleProps is used as an implicit indication of:
  // w/ inlineStyleProps -- process all styles and return an object with style props
  // w/o inlineStyleProps -- default inline styles addition is done externally,
  //                     return styles object directly
  const legacy = !inlineStyleProps

  // Process styleName through the `classnames`-like function.
  // This allows to specify styleName as an array or an object,
  // not just the string.
  styleName = cc(styleName)

  const htmlClasses = (styleName || '').split(' ').filter(Boolean)
  const resProps = getStyleProps(htmlClasses, fileStyles, legacy)

  // In the legacy mode, return root styles right away
  if (legacy) return resProps[ROOT_STYLE_PROP_NAME]

  // 1. Add global styles
  appendStyleProps(resProps, getStyleProps(htmlClasses, globalStyles))

  // 2. Add local styles
  appendStyleProps(resProps, getStyleProps(htmlClasses, localStyles))

  // 3. Add inline styles
  appendStyleProps(resProps, inlineStyleProps)
  return resProps
}

function appendStyleProps (target, appendProps) {
  for (const propName in appendProps) {
    if (target[propName]) {
      if (isArray(appendProps[propName])) {
        target[propName] = target[propName].concat(appendProps[propName])
      } else {
        target[propName].push(appendProps[propName])
      }
    } else {
      target[propName] = appendProps[propName]
    }
  }
}

// Process all styles, including the ::part() ones.
function getStyleProps (htmlClasses, styles, legacyRootOnly) {
  const res = {}
  for (const selector in styles) {
    // Find out which part (or root) this selector is targeting
    const match = selector.match(PART_REGEX)
    const attr = match ? getPropName(match[1]) : ROOT_STYLE_PROP_NAME

    // Don't process part if legacyRootOnly is specified
    if (legacyRootOnly && attr !== ROOT_STYLE_PROP_NAME) continue

    // Strip ::part() if it exists
    const pureSelector = selector.replace(PART_REGEX, '')

    // Check if the selector is matching our list of existing classes
    const cssClasses = pureSelector.split('.')
    if (!arrayContainedInArray(cssClasses, htmlClasses)) continue

    // Push selector's style to the according part's array of styles.
    // We have a nested array structure here to account for the selector specificity.
    // This way styles for selector with 3 classes take priority
    // over selectors with 2 classes, etc.

    // Note: Specificity here does not strictly equal the standard
    //       since we only use classes to increase the specificity.
    //       In future this might change when we add support for tags, but for now
    //       it is a single digit increment starting from 0 and equalling the amount
    //       of classes in the selector.
    const specificity = cssClasses.length - 1
    if (!res[attr]) res[attr] = []
    if (!res[attr][specificity]) res[attr][specificity] = []
    res[attr][specificity].push(styles[selector])
  }
  return res
}

function getPropName (name) {
  return name + 'Style'
}

function arrayContainedInArray (cssClasses, htmlClasses) {
  for (let i = 0; i < cssClasses.length; i++) {
    if (htmlClasses.indexOf(cssClasses[i]) === -1) return false
  }
  return true
};

// classcat 4.0.2
// https://github.com/jorgebucaran/classcat

function cc (names) {
  let i
  let len
  let tmp = typeof names
  let out = ''

  if (tmp === 'string' || tmp === 'number') return names || ''

  if (isArray(names) && names.length > 0) {
    for (i = 0, len = names.length; i < len; i++) {
      if ((tmp = cc(names[i])) !== '') out += (out && ' ') + tmp
    }
  } else {
    for (i in names) {
      // eslint-disable-next-line no-prototype-builtins
      if (names.hasOwnProperty(i) && names[i]) out += (out && ' ') + i
    }
  }

  return out
}
