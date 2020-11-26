const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const PACKAGES_PATH = path.join(process.cwd(), '../packages')

const packages = fs.readdirSync(PACKAGES_PATH)

packages.forEach(packageName => {
  const infoPath = PACKAGES_PATH + '/' + packageName + '/package.json'

  if (fs.existsSync(infoPath)) {
    const info = require(infoPath)
    unpublish(info.name)
  }
})

function unpublish (name) {
  exec(`npm --force unpublish ${name} --registry http://localhost:4873/`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    console.log(`stdout: ${stdout}`)
  })
}
