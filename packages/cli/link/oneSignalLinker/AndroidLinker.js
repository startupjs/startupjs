const fs = require('fs')
const { mainBuildGradleAndroid, appBuildGradleAndroid, androidManifestXML } = require('../path')
const { errorn, warnn, logn, infon, debugn } = require('../log')

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

    logn('  Linking app/build.gradle')
    this.linkAppBuildGradleAndroid()

    logn('  Linking build.gradle')
    this.linkMainBuildGradle()
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

    const compileSdkVersionRegExp = /(compileSdkVersion.*?)\d\d/
    const buildToolsVersionRegExp = /(buildToolsVersion.*?)".*/

    const compileSdkVersionActual = '29'
    const buildToolsVersionActual = '"29.0.2"'

    debugn('    Linking oneSignal files in build.gradle')
    return content.replace(compileSdkVersionRegExp, `$1${compileSdkVersionActual}`)
      .replace(buildToolsVersionRegExp, `$1${buildToolsVersionActual}`)
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

    const startFileSettings = `\
buildscript {
    repositories {
        maven { url 'https://plugins.gradle.org/m2/' } // Gradle Plugin Portal 
    }
    dependencies {
        classpath 'gradle.plugin.com.onesignal:onesignal-gradle-plugin:[0.12.9, 0.99.99]'
    }
}

apply plugin: 'com.onesignal.androidsdk.onesignal-gradle-plugin'
`

    debugn('    Linking files in app/build.gradle')
    return startFileSettings + content
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

    const manifestApplicationEndRegExp = /<activity[\s\S]*?>/
    const manifestApplicationEndOneSignal = content.match(manifestApplicationEndRegExp)[0].replace(/>$/,
      '\n        android:launchMode="singleTask">'
    )

    debugn('    Linking files in AndroidManifestXML')
    return content.replace(manifestApplicationEndRegExp, manifestApplicationEndOneSignal)
  }

  _isLinkMainBuildGradle (content) {
    return content.match(/compileSdkVersion.*?(\d\d)/)[1] >= 26 ||
            content.match(/buildToolsVersion.*?(\d\d).*/)[1] >= 26
  }

  _isLinkAppBuildGradleAndroid (content) {
    return /maven \{ url 'https:\/\/plugins\.gradle\.org\/m2\/' \}/.test(content) ||
          /classpath 'gradle\.plugin\.com\.onesignal:onesignal-gradle-plugin:\[0\.12\.9, 0\.99\.99\]'/.test(content) ||
          /apply plugin: 'com\.onesignal\.androidsdk\.onesignal-gradle-plugin'/.test(content)
  }

  _isLinkAndroidManifestXML (content) {
    return /android:launchMode="singleTask"/.test(content)
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
