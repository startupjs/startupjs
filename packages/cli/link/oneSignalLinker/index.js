const AdroidLinker = require('./AndroidLinker')
const IOSLinker = require('./IOSLinker')
const OneSignalFiles = require('./OneSignalFiles')
const { infon, errorn } = require('../log')

function oneSignalLinker () {
  if (!isOneSignalPackage()) {
    errorn('@startupjs/push-notifications is not installed!')
    return
  }
  infon('  Linking OneSignal')

  infon('\nRunning Android OneSignal postlink script\n')
  new AdroidLinker().link()

  infon('\nRunning iOS OneSignal postlink script\n')
  new IOSLinker().link()

  infon('\nRunning add OneSignal files script\n')
  new OneSignalFiles().link()
}

function isOneSignalPackage () {
  try {
    const path = require.resolve('@startupjs/push-notifications')
    return !!path
  } catch (err) {
    return false
  }
}

module.exports = oneSignalLinker
