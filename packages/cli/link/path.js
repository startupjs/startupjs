const glob = require('glob')
const ignoreFolders = { ignore: ['node_modules/**', '**/build/**'] }
const styles = glob.sync('**/values/styles.xml', ignoreFolders)

// TODO: some people get undefined when trying to find mainApplicationJava
// const mainApplicationJava = glob.sync(
//   '**/MainApplication.java',
//   ignoreFolders
// )[0]

exports.mainActivityJava = glob.sync('**/MainActivity.java', ignoreFolders)[0]
// exports.mainApplicationJava = mainApplicationJava
// exports.rootGradle = mainApplicationJava
//   .replace(/android\/app\/.*\.java/, 'android/build.gradle')
exports.styles = styles
exports.appDelegate = glob.sync('**/AppDelegate.m', ignoreFolders)[0]
exports.podFile = glob.sync('**/Podfile', ignoreFolders)[0]
