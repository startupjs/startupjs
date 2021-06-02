const { infon, logn } = require('./log')
const { pushNotificationsLinkerIos } = require('./pushNotificationsLinker')

module.exports = () => {
  infon('\nRunning iOS postlink script\n')
  pushNotificationsLinkerIos()
  logn('\n')
}
