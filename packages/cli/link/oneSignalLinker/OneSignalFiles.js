const fs = require('fs')
const path = require('path')
const { publicFolder } = require('../path')
const { errorn, warnn, logn, infon, debugn } = require('../log')
const {
  OneSignalSDKUpdaterWorkerFileName,
  OneSignalSDKUpdaterWorkerContent,
  OneSignalSDKWorkerFileName,
  OneSignalSDKWorkerContent
} = require('../templates')

class OneSignalFiles {
  constructor () {
    this.publicFolderPath = publicFolder
  }

  link () {
    if (!this.checkRouts()) return
    logn('  Add OneSignal files')
    this.addFiles()
  }

  addFiles () {
    try {
      const OneSignalSDKUpdaterWorkerPath = path.resolve(this.publicFolderPath, OneSignalSDKUpdaterWorkerFileName)
      if (fs.existsSync(OneSignalSDKUpdaterWorkerPath)) {
        warnn(`    ${OneSignalSDKUpdaterWorkerFileName} already exist`)
      } else {
        debugn(`    Add ${OneSignalSDKUpdaterWorkerFileName}`)
        fs.writeFileSync(OneSignalSDKUpdaterWorkerPath, OneSignalSDKUpdaterWorkerContent)
      }

      const OneSignalSDKWorkerPath = path.resolve(this.publicFolderPath, OneSignalSDKWorkerFileName)
      if (fs.existsSync(OneSignalSDKWorkerPath)) {
        warnn(`    ${OneSignalSDKWorkerFileName} already exist`)
      } else {
        debugn(`    Add ${OneSignalSDKWorkerFileName}`)
        fs.writeFileSync(OneSignalSDKWorkerPath, OneSignalSDKWorkerContent)
      }

      infon('  Files were added successfully!')
    } catch (e) {
      errorn('Files were not been added. ' + e.message)
    }
  }

  checkRouts () {
    if (!this.publicFolderPath) {
      errorn(
        'public folder not found! Does the folder exist in the root directory?'
      )
      return false
    }
    return true
  }
}

module.exports = OneSignalFiles
