const path = require('path')
const fs = require('fs')
const jestExpect = require('expect')
const { toMatchImageSnapshot } = require('jest-image-snapshot')
jestExpect.extend({ toMatchImageSnapshot })

function matchImageSnapshot (imagePath, __dirname) {
  const imageBuffer = fs.readFileSync(imagePath)
  jestExpect(imageBuffer).toMatchImageSnapshot({
    customSnapshotsDir: path.resolve(__dirname, '__image_snapshots__'),
    customDiffDir: path.resolve(process.cwd(), '__diff_output__'),
    customSnapshotIdentifier: ({ currentTestName }) => currentTestName
  })
}

module.exports.jestExpect = jestExpect
module.exports.configPath = path.resolve(__dirname, 'config.js')
module.exports.matchImageSnapshot = matchImageSnapshot
