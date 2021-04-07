const { infon, logn } = require('./log')
const StylesLinker = require('./stylesLinker')
// uncomment when the android in Detox will be implemented
// const DetoxLinker = require('./DetoxLinker')

// it isn't need at currunt version because we use react-native-tab-view@3.0.0
// const ActivityLinker = require('./activityLinker')

module.exports = () => {
  infon('\nRunning Android postlink script\n')

  // React-native-gesture-handler is not used in the current version, but it is possible to link for it in the future
  // new ActivityLinker().link()
  // logn()

  new StylesLinker().link()
  // logn()
  // new DetoxLinker().link()
  logn('\n')
}
