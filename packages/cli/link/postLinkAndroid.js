const { infon, logn } = require('./log')
// it isn't need at currunt version becouse we use react-native-tab-view@3.0.0
// const ActivityLinker = require('./activityLinker')
const StylesLinker = require('./stylesLinker')
// uncomment when the android in Detox will be implemented
// const DetoxLinker = require('./DetoxLinker')

module.exports = () => {
  infon('\nRunning Android postlink script\n')
  // new ActivityLinker().link()
  // logn()
  new StylesLinker().link()
  // logn()
  // new DetoxLinker().link()
  logn('\n')
}
