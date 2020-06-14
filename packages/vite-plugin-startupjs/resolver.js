module.exports = {
  alias (id) {
    if (id === 'react-dom/unstable-native-dependencies') {
      return 'vite-plugin-startupjs/vendor/react-dom-unstable-native-dependencies.development'
    } else if (/^lodash(?:$|\/)/.test(id)) {
      return id.replace('lodash', 'lodash-es')
    } else if (id === 'react-native') {
      return 'vite-plugin-startupjs/vendor/react-native-web'
    } else if (/^racer(?:$|\/)/.test(id)) {
      return id.replace('racer', '@startupjs/racer')
    } else if (id === 'react-is') {
      return '@startupjs/react-is'
    } else if (id === 'prop-types') {
      return '@startupjs/prop-types'
    } else if (id === '@fortawesome/react-native-fontawesome') {
      return '@startupjs/react-native-fontawesome'
    } else if (id === 'react-native-svg') {
      return 'react-native-svg/src/ReactNativeSVG.web.ts'
    }
  }
}
