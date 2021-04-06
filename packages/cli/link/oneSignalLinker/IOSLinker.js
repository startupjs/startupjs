const fs = require('fs')
const { podFile, oneSignalNotificationServise } = require('../path')
const { errorn, warnn, logn, infon, debugn } = require('../log')
const { NotificationService } = require('../templates')

class IOSLinker {
  constructor () {
    this.podfilePath = podFile
    this.notificationServicePath = oneSignalNotificationServise
  }

  link () {
    if (!this.checkRouts()) return

    logn('  Linking Podfile')
    this.linkPodfile()

    logn('  Linking notificationServicePath.swift')
    this.linkNotificationServicePath()
  }

  linkPodfile () {
    try {
      let content = fs.readFileSync(this.podfilePath, 'utf8')
      content = this._linkPodfile(content)
      fs.writeFileSync(this.podfilePath, content)
      infon('  Podfile linked successfully!')
    } catch (e) {
      errorn('Podfile was not linked. ' + e.message)
    }
  }

  _linkPodfile (content) {
    if (this._isLinkPodfile(content)) {
      warnn('    Podfile already linked')
      return content
    }

    const oneSignalPodfile = `\
target 'OneSignalNotificationServiceExtension' do
  pod 'OneSignal', '>= 3.0', '< 4.0'
end 
`

    debugn('    Linking Podfile')
    return content + oneSignalPodfile
  }

  linkNotificationServicePath () {
    try {
      let content = fs.readFileSync(this.notificationServicePath, 'utf8')
      content = this._linkNotificationServicePath(content)
      fs.writeFileSync(this.notificationServicePath, content)
      infon('  notificationServicePath.swift linked successfully!')
    } catch (e) {
      errorn('notificationServicePath.swift was not linked. ' + e.message)
    }
  }

  _linkNotificationServicePath (content) {
    if (this._isLinkNotificationServicePath(content)) {
      warnn('    notificationServicePath.swift already linked')
      return content
    }
    debugn('    Linking notificationServicePath.swift')
    return NotificationService
  }

  _isLinkPodfile (content) {
    return /target 'OneSignalNotificationServiceExtension' do/.test(content)
  }

  _isLinkNotificationServicePath (content) {
    return /import OneSignal/.test(content)
  }

  checkRouts () {
    if (!this.podfilePath) {
      errorn(
        'Podfile not found! Does the file exist in the correct folder?'
      )
      return false
    }
    if (!this.notificationServicePath) {
      errorn(
        'NotificationServicePath not found! Does the file exist in the correct folder?'
      )
      return false
    }
    return true
  }
}

module.exports = IOSLinker
