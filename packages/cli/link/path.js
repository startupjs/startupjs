const glob = require('glob')
const path = require('path')
const ignoreFolders = { ignore: ['node_modules/**', '**/build/**'] }
const styles = glob.sync('**/values/styles.xml', ignoreFolders)
const appJsonPath = glob.sync('**/app.json', ignoreFolders)[0]
if (!appJsonPath) {
  throw new Error('Can\'t find app.json')
}
// TODO: some people get undefined when trying to find mainApplicationJava
// const mainApplicationJava = glob.sync(
//   '**/MainApplication.java',
//   ignoreFolders
// )[0]

// Android files
const mainActivityJava = glob.sync('**/MainActivity.java', ignoreFolders)[0]

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
const APP_NAME = require(path.resolve(process.cwd(), appJsonPath)).name
const networkSecurityConfigFolder = 'android/app/src/main/res/xml'
const networkSecurityConfigRout = networkSecurityConfigFolder + '/network_security_config.xml'
const detoxTestFolder = `android/app/src/androidTest/java/com/${APP_NAME}`
const detoxTestRoute = detoxTestFolder + '/DetoxTest.java'

// iOS files
const appDelegateH = glob.sync('**/AppDelegate.h', ignoreFolders)[0]
const appDelegateM = glob.sync('**/AppDelegate.m', ignoreFolders)[0]
const podFilePath = glob.sync('**/Podfile', ignoreFolders)[0]

// exports

exports.mainActivityJava = mainActivityJava
// exports.mainApplicationJava = mainApplicationJava
// exports.rootGradle = mainApplicationJava
//   .replace(/android\/app\/.*\.java/, 'android/build.gradle')
exports.styles = styles

exports.appDelegateH = appDelegateH
exports.appDelegateM = appDelegateM
exports.podFilePath = podFilePath

exports.networkSecurityConfigFolder = networkSecurityConfigFolder
exports.networkSecurityConfigRout = networkSecurityConfigRout
exports.detoxTestFolder = detoxTestFolder
exports.detoxTestRoute = detoxTestRoute
exports.mainBuildGradleAndroid = mainBuildGradleAndroid
exports.appBuildGradleAndroid = appBuildGradleAndroid
exports.androidManifestXML = androidManifestXML

exports.APP_NAME = APP_NAME
