module.exports = `const { name } = require('./app.json')
const { configPath } = require('@startupjs/e2e')

module.exports = {
  "testRunner": "jest",
  "runnerConfig": configPath,
  "configurations": {
    "ios": {
      "type": "ios.simulator",
      "binaryPath": \`ios/build/Build/Products/Release-iphonesimulator/\${name}.app\`,
      "build": \`xcodebuild -workspace ios/\${name}.xcworkspace -scheme \${name} -configuration Release -sdk iphonesimulator -derivedDataPath ios/build\`,
      "device": {
        "type": "iPhone 11"
      }
    },
    "android": {
      "binaryPath": "android/app/build/outputs/apk/release/app-release.apk",
      "build": "cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release && cd ..",
      "type": "android.emulator",
      "device": {
        "avdName": "Pixel_2_API_28"
      }
    }
  }
}
`
