const glob = require('glob')
const fs = require('fs')
const ignoreFolders = { ignore: ['node_modules/**', '**/build/**'] }
const styles = glob.sync('**/values/styles.xml', ignoreFolders)

// TODO: some people get undefined when trying to find mainApplicationJava
// const mainApplicationJava = glob.sync(
//   '**/MainApplication.java',
//   ignoreFolders
// )[0]

// Detox
const mainBuildGradleAndroid = glob.sync(
  '**/android/build.gradle',
  ignoreFolders
)[0]
const appBuildGradleAndroid = glob.sync(
  '**/android/app/build.gradle',
  ignoreFolders
)[0]
const androidManifestXML = glob.sync(
  '**/main/AndroidManifest.xml',
  ignoreFolders
)[0]

const APP_NAME = getAppName()

const networkSecurityConfigFolder = 'android/app/src/main/res/xml'
const networkSecurityConfigRout = networkSecurityConfigFolder + '/network_security_config.xml'

const detoxTestFolder = `android/app/src/androidTest/java/com/${APP_NAME}`
const detoxTestRoute = detoxTestFolder + '/DetoxTest.java'

function getAppName () {
  let content = fs.readFileSync(appBuildGradleAndroid, 'utf8')
  const appNameString = content.match(/applicationId.*/)[0]
  const appName = appNameString.match(/"com.*"/)[0].replace(/"/g, '').replace(/com\./, '')
  return appName
}

// exports

exports.mainActivityJava = glob.sync('**/MainActivity.java', ignoreFolders)[0]
// exports.mainApplicationJava = mainApplicationJava
// exports.rootGradle = mainApplicationJava
//   .replace(/android\/app\/.*\.java/, 'android/build.gradle')
exports.styles = styles
exports.appDelegate = glob.sync('**/AppDelegate.m', ignoreFolders)[0]
exports.podFile = glob.sync('**/Podfile', ignoreFolders)[0]

exports.networkSecurityConfigFolder = networkSecurityConfigFolder
exports.networkSecurityConfigRout = networkSecurityConfigRout
exports.detoxTestFolder = detoxTestFolder
exports.detoxTestRoute = detoxTestRoute
exports.mainBuildGradleAndroid = mainBuildGradleAndroid
exports.appBuildGradleAndroid = appBuildGradleAndroid
exports.androidManifestXML = androidManifestXML
exports.APP_NAME = APP_NAME
