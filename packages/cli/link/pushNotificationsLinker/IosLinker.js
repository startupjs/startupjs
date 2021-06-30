const fs = require('fs')
const { appDelegateH, appDelegateM, podFilePath } = require('../path')
const { errorn, warnn, logn, infon, debugn } = require('../log')
const { appDelegateHHeader, appDelegateHDeps, appDelegateMHeader, implementationBody, appDelegateMDeps, podFile } = require('./constants')

class IosLinker {
  constructor () {
    this.AppDelegateH = appDelegateH
    this.AppDelegateM = appDelegateM
    this.podfile = podFilePath
  }

  link () {
    if (!this.checkRouts()) return

    logn('  Linking AppDelegate.h')
    this.linkAppDelegateH()

    logn('  Linking AppDelegate.m')
    this.linkAppDelegateM()

    logn('  Linking Podfile')
    this.linkPodfile()
  }

  linkAppDelegateH () {
    try {
      let content = fs.readFileSync(this.AppDelegateH, 'utf8')
      content = this._linkAppDelegateH(content)
      fs.writeFileSync(this.AppDelegateH, content)
      infon('  AppDelegate.h linked successfully!')
    } catch (e) {
      errorn('AppDelegate.h was not linked. ' + e.message)
    }
  }

  linkAppDelegateM () {
    try {
      let content = fs.readFileSync(this.AppDelegateM, 'utf8')
      content = this._linkAppDelegateM(content)
      fs.writeFileSync(this.AppDelegateM, content)
      infon('  AppDelegate.m linked successfully!')
    } catch (e) {
      errorn('AppDelegate.m was not linked. ' + e.message)
    }
  }

  linkPodfile () {
    try {
      let content = fs.readFileSync(this.podfile, 'utf8')
      content = this._linkPodfile(content)
      fs.writeFileSync(this.podfile, content)
      infon('  Podfile linked successfully!')
    } catch (e) {
      errorn('Podfile was not linked. ' + e.message)
    }
  }

  _linkAppDelegateH (content) {
    if (this._isLinkAppDelegateH(content)) {
      warnn('    AppDelegate.h already linked')
      return content
    }

    const appDelegateHDepsRegExp = /@interface AppDelegate.*>/

    debugn('    Linking push-notifications files in AppDelegate.h')
    return appDelegateHHeader + content.replace(appDelegateHDepsRegExp, appDelegateHDeps)
  }

  _linkAppDelegateM (content) {
    if (this._isLinkAppDelegateM(content)) {
      warnn('    AppDelegate.m already linked')
      return content
    }

    const headerRegExp = /(#import <React\/RCTRootView\.h>)/
    const implementationBodyEndRegExp = /(return YES;\s\S*?})/

    debugn('    Linking push-notifications files in AppDelegate.m')
    return content.replace(headerRegExp, `$1${appDelegateMHeader}`)
      .replace(implementationBodyEndRegExp, `${implementationBody}$1${appDelegateMDeps}`)
  }

  _linkPodfile (content) {
    if (this._isLinkPodfile(content)) {
      warnn('    Podfile already linked')
      return content
    }

    const podfilePodsRegExp = /(platform :ios, '10.0')/

    debugn('    Linking push-notifications files in Podfile')
    return content.replace(podfilePodsRegExp, `$1${podFile}`)
  }

  _isLinkAppDelegateH (content) {
    return /#import <UserNotifications\/UNUserNotificationCenter\.h>/.test(content) ||
            /UNUserNotificationCenterDelegate/.test(content)
  }

  _isLinkAppDelegateM (content) {
    return /#import <UserNotifications\/UserNotifications\.h>/.test(content) ||
            /#import <RNCPushNotificationIOS\.h>/.test(content) ||
            /UNUserNotificationCenter \*center = \[UNUserNotificationCenter currentNotificationCenter\]/.test(content) ||
            /RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken/.test(content) ||
            /RNCPushNotificationIOS didReceiveNotificationResponse/.test(content)
  }

  _isLinkPodfile (content) {
    return /pod 'Firebase\/Messaging'/.test(content)
  }

  checkRouts () {
    if (!this.AppDelegateH) {
      errorn(
        'AppDelegate.h not found! Does the file exist in the correct folder?'
      )
      return false
    }
    if (!this.AppDelegateM) {
      errorn(
        'AppDelegate.m not found! Does the file exist in the correct folder?'
      )
      return false
    }
    if (!this.podfile) {
      errorn(
        'PodFile not found! Does the file exist in the correct folder?'
      )
      return false
    }
    return true
  }
}

module.exports = IosLinker
