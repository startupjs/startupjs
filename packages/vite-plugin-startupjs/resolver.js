module.exports = {
  alias (id) {
    if (id === 'react-dom/unstable-native-dependencies') {
      return 'vite-plugin-startupjs/vendor/react-dom-unstable-native-dependencies.development.js'
    } else if (id === '@env') {
      return '/config.json'
    } else if (/^lodash(?:$|\/)/.test(id)) {
      return id.replace('lodash', 'lodash-es')
    } else if (/^react-native(?:$|\/)/.test(id)) {
      return id.replace('react-native', 'react-native-web')
    } else if (id === 'react-native-svg') {
      return 'react-native-web-svg'
    }
  }
}
