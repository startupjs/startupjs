const { infon, logn } = require('./log')
const ActivityLinker = require('./activityLinker')
const StylesLinker = require('./stylesLinker')

module.exports = () => {
  infon('\nRunning Android postlink script\n')
  new ActivityLinker().link()
  logn()
  new StylesLinker().link()
  logn('\n')
}
