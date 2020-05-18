var rnProcess = require('react-native-dynamic-style-processor').process
var dimensions = require('./dimensions')

var isArray = Array.isArray || function (arg) {
  return Object.prototype.toString.call(arg) === '[object Array]'
}

exports.process = function processStyleName (styleName, cssStyles) {
  // If @media is used, force trigger access to the observable value.
  // Whenever that value changes the according components will
  // automatically rerender.
  // The change is triggered globally using the useMediaChange() hook
  // in @startupjs/app, which sets up the Dimensions 'change' listener
  // eslint-disable-next-line no-unused-expressions
  if (hasMedia(cssStyles)) dimensions.width

  cssStyles = rnProcess(cssStyles)

  // Process styleName through the `classnames`-like function.
  // This allows to specify styleName as an array or an object,
  // not just the string.
  styleName = cc(styleName)

  var htmlClasses = (styleName || '').split(' ').filter(Boolean)
  if (htmlClasses.length > 1) {
    htmlClasses = addMultiClasses(htmlClasses, cssStyles)
  }
  var res = []
  for (var i = 0; i < htmlClasses.length; i++) {
    var htmlClass = htmlClasses[i]
    if (cssStyles[htmlClass]) res.push(cssStyles[htmlClass])
  }
  return res
}

function hasMedia (cssStyles) {
  for (var selector in cssStyles) {
    if (/^@media/.test(selector)) {
      return true
    }
  }
}

function addMultiClasses (htmlClasses, cssStyles) {
  var resByAmount = {}
  var maxAmount = 0
  for (var selector in cssStyles) {
    if (!/\./.test(selector)) continue
    var cssClasses = selector.split('.')
    if (arrayContainedInArray(cssClasses, htmlClasses)) {
      var amount = cssClasses.length
      if (amount > maxAmount) maxAmount = amount
      if (!resByAmount[amount]) resByAmount[amount] = []
      resByAmount[amount].push(selector)
    }
  }
  for (var j = 0; j <= maxAmount; j++) {
    if (!resByAmount[j]) continue
    htmlClasses = htmlClasses.concat(resByAmount[j])
  }
  return htmlClasses
};

function arrayContainedInArray (cssClasses, htmlClasses) {
  for (var i = 0; i < cssClasses.length; i++) {
    if (htmlClasses.indexOf(cssClasses[i]) === -1) return false
  }
  return true
};

// classcat 4.0.2
// https://github.com/jorgebucaran/classcat

function cc (names) {
  var i
  var len
  var tmp = typeof names
  var out = ''

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
