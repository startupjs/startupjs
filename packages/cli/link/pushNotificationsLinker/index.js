const AdroidLinker = require('./AndroidLinker')
const IOSLinker = require('./IOSLinker')
const { infon } = require('../log')

function pushNotificationsLinkerAndroid () {
  if (!isPushNotificationsPackage()) {
    return
  }
  infon('  Linking Android Push-notifications')

  infon('\nRunning Android postlink script\n')
  new AdroidLinker().link()
}

function pushNotificationsLinkerIos () {
  if (!isPushNotificationsPackage()) {
    return
  }
  infon('  Linking iOS Push-notifications')

  infon('\nRunning iOS OneSignal postlink script\n')
  new IOSLinker().link()
}

function isPushNotificationsPackage () {
  try {
    const path = require.resolve('@startupjs/push-notifications')
    return !!path
  } catch (err) {
    return false
  }
}

module.exports = {
  pushNotificationsLinkerAndroid,
  pushNotificationsLinkerIos
}
