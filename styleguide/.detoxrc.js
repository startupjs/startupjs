const APP_NAME = require('./app.json').name

module.exports = {
  "testRunner": "jest",
  "runnerConfig": "e2e/config.json",
  "configurations": {
    "ios": {
      "type": "ios.simulator",
      "binaryPath": `ios/build/Build/Products/Release-iphonesimulator/${APP_NAME}.app`,
      "build": `xcodebuild -workspace ios/${APP_NAME}.xcworkspace -scheme ${APP_NAME} -configuration Release -sdk iphonesimulator -derivedDataPath ios/build`,
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