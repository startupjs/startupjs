const { infon, logn } = require('./log')
const StylesLinker = require('./stylesLinker')
const { pushNotificationsLinkerAndroid } = require('./pushNotificationsLinker')
// uncomment when the android in Detox will be implemented
// const DetoxLinker = require('./DetoxLinker')

module.exports = () => {
  infon('\nRunning Android postlink script\n')

  new StylesLinker().link()

  logn()
  pushNotificationsLinkerAndroid()
  logn('\n')
}
