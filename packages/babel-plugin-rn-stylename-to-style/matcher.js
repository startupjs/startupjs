const ROOT_STYLE_PROP_NAME = 'style'
const PART_REGEX = /::?part\(([^)]+)\)/

const isArray = Array.isArray || function (arg) {
  return Object.prototype.toString.call(arg) === '[object Array]'
}

export default function matcher (styleName, cssStyles, inlineStyles) {
  // inlineStyles is used as an implicit indication of:
  // w/ inlineStyles -- process all styles and return an object with style props
  // w/o inlineStyles -- default inline styles addition is done externally,
  //                     return styles object directly
  const pure = !inlineStyles

  // Process styleName through the `classnames`-like function.
  // This allows to specify styleName as an array or an object,
  // not just the string.
  styleName = cc(styleName)

  const htmlClasses = (styleName || '').split(' ').filter(Boolean)
  const styleProps = getStyleProps(htmlClasses, cssStyles, pure)

  // If inline styles exist, add them to the end to give them priority over
  // styles from CSS file.
  if (inlineStyles) {
    for (const propName in inlineStyles) {
      if (styleProps[propName]) {
        styleProps[propName].push(inlineStyles[propName])
      } else {
        styleProps[propName] = inlineStyles[propName]
      }
    }
    return styleProps
  } else {
    return styleProps[ROOT_STYLE_PROP_NAME]
  }
}

// Process all styles, including the ::part() ones.
function getStyleProps (htmlClasses, cssStyles, rootOnly) {
  const res = {
    [ROOT_STYLE_PROP_NAME]: []
  }
  for (const selector in cssStyles) {
    // Find out which part (or root) this selector is targeting
    const match = selector.match(PART_REGEX)
    const attr = match ? getPropName(match[1]) : ROOT_STYLE_PROP_NAME

    // Don't process part if rootOnly is specified
    if (rootOnly && attr !== ROOT_STYLE_PROP_NAME) continue

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
    res[attr][specificity].push(cssStyles[selector])
  }
  return res
}

function getPropName (name) {
  return name + 'Style'
}

function arrayContainedInArray (cssClasses, htmlClasses) {
  for (var i = 0; i < cssClasses.length; i++) {
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
