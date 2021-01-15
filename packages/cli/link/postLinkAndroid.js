const { infon, logn } = require('./log')
const ActivityLinker = require('./activityLinker')
const StylesLinker = require('./stylesLinker')
const DetoxLinker = require('./DetoxLinker')

module.exports = () => {
  infon('\nRunning Android postlink script\n')
  new ActivityLinker().link()
  logn()
  new StylesLinker().link()
  logn()
  new DetoxLinker().link()
  logn('\n')
}
