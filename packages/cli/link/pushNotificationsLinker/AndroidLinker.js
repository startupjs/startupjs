const fs = require('fs')
const { mainBuildGradleAndroid, appBuildGradleAndroid, androidManifestXML } = require('../path')
const { errorn, warnn, logn, infon, debugn } = require('../log')
const { permisionsString, aplicationBodyString, androidBuildGradleDeps, appGradleBuildHeader, appGradleBuildDeps } = require('./constants')

class AndroidLinker {
  constructor () {
    this.mainBuildGradleAndroid = mainBuildGradleAndroid
    this.appBuildGradleAndroid = appBuildGradleAndroid
    this.androidManifestXML = androidManifestXML
  }

  link () {
    if (!this.checkRouts()) return

    logn('  Linking AndroidManifest.xml')
    this.linkAndroidManifestXML()

    logn('  Linking build.gradle')
    this.linkMainBuildGradle()

    logn('  Linking app/build.gradle')
    this.linkAppBuildGradleAndroid()
  }

  linkMainBuildGradle () {
    try {
      let content = fs.readFileSync(this.mainBuildGradleAndroid, 'utf8')
      content = this._linkMainBuildGradle(content)
      fs.writeFileSync(this.mainBuildGradleAndroid, content)
      infon('  build.gradle linked successfully!')
    } catch (e) {
      errorn('build.gradle was not linked. ' + e.message)
    }
  }

  _linkMainBuildGradle (content) {
    if (this._isLinkMainBuildGradle(content)) {
      warnn('    build.gradle already linked')
      return content
    }

    const mainGradleDepsRegExp = /(dependencies \{)/

    debugn('    Linking oneSignal files in build.gradle')
    return content.replace(mainGradleDepsRegExp, `$1${androidBuildGradleDeps}`)
  }

  linkAppBuildGradleAndroid () {
    try {
      let content = fs.readFileSync(this.appBuildGradleAndroid, 'utf8')
      content = this._linkAppBuildGradleAndroid(content)
      fs.writeFileSync(this.appBuildGradleAndroid, content)
      infon('  app/build.gradle linked successfully!')
    } catch (e) {
      errorn('app/build.gradle was not linked. ' + e.message)
    }
  }

  _linkAppBuildGradleAndroid (content) {
    if (this._isLinkAppBuildGradleAndroid(content)) {
      warnn('    app/build.gradle already linked')
      return content
    }

    const depsRegExp = /(dependencies.*{)/

    debugn('    Linking files in app/build.gradle')
    return appGradleBuildHeader + content.replace(depsRegExp, `$1${appGradleBuildDeps}`)
  }

  linkAndroidManifestXML () {
    try {
      let content = fs.readFileSync(this.androidManifestXML, 'utf8')
      content = this._linkAndroidManifestXML(content)
      fs.writeFileSync(this.androidManifestXML, content)
      infon('  AndroidManifestXML linked successfully!')
    } catch (e) {
      errorn('AndroidManifestXML was not linked. ' + e.message)
    }
  }

  _linkAndroidManifestXML (content) {
    if (this._isLinkAndroidManifestXML(content)) {
      warnn('    AndroidManifestXML already linked')
      return content
    }

    let changedContent = content

    const manifestApplicationEndRegExp = /(<uses-permission android:name="android\.permission\.INTERNET" \/>)/
    changedContent = changedContent.replace(manifestApplicationEndRegExp,
      '$1' + permisionsString
    )

    const manifestApplicationRegExp = /(<application[\s\S]*?>)/
    changedContent = changedContent.replace(manifestApplicationRegExp,
      '$1' + aplicationBodyString
    )

    debugn('    Linking files in AndroidManifestXML')
    return changedContent
  }

  _isLinkMainBuildGradle (content) {
    return /classpath\('com.google.gms:google-services/.test(content)
  }

  _isLinkAppBuildGradleAndroid (content) {
    return /apply plugin: 'com\.google\.gms\.google-services'/.test(content) ||
          /implementation platform\('com\.google\.firebase:firebase-bom/.test(content) ||
          /implementation 'com\.google\.firebase:firebase-analytics'/.test(content)
  }

  _isLinkAndroidManifestXML (content) {
    return /android\.permission\.VIBRATE"/.test(content) ||
            /android\.permission\.RECEIVE_BOOT_COMPLETED"/.test(content) ||
            /RNPushNotificationListenerService/.test(content)
  }

  checkRouts () {
    if (!this.mainBuildGradleAndroid) {
      errorn(
        'build.gradle not found! Does the file exist in the correct folder?'
      )
      return false
    }
    if (!this.appBuildGradleAndroid) {
      errorn(
        'app/build.gradle not found! Does the file exist in the correct folder?'
      )
      return false
    }
    if (!this.androidManifestXML) {
      errorn(
        'main/AndroidManifest.xml not found! Does the file exist in the correct folder?'
      )
      return false
    }
    return true
  }
}

module.exports = AndroidLinker
