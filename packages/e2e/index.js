const path = require('path')
const fs = require('fs')
const jestExpect = require('expect')
const { toMatchImageSnapshot } = require('jest-image-snapshot')
jestExpect.extend({ toMatchImageSnapshot })

function matchImageSnapshot (imagePath) {
  const imageBuffer = fs.readFileSync(imagePath)
  jestExpect(imageBuffer).toMatchImageSnapshot({
    customDiffDir: path.resolve(process.cwd(), 'e2e/__diff_output__'),
    customSnapshotIdentifier: ({ currentTestName }) => currentTestName
  })
}

module.exports.jestExpect = jestExpect
module.exports.configPath = path.resolve(__dirname, 'config.js')
module.exports.matchImageSnapshot = matchImageSnapshot
