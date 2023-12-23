import fs from 'fs'
import path from 'path'
import { $ } from 'execa'
import { scriptsPath } from './helpers.js'

export default {
  name: 'init-pm',
  description: 'Create a new project on github from template',
  fn: initPm
}

async function initPm () {
  if (!scriptsPath) {
    throw new Error('@startupjs/cli: \'scriptsPath\' wasn\t found')
  }

  await $({ shell: true, stdio: 'inherit' })`${scriptsPath} init-pm`

  const packageJSONPath = path.join(process.cwd(), 'package.json')
  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath).toString())

  packageJSON.scripts = {
    ...packageJSON.scripts,
    task: 'npx startupjs task',
    pr: 'npx startupjs pr'
  }

  fs.writeFileSync(
    packageJSONPath,
    `${JSON.stringify(packageJSON, null, 2)}\n`
  )
}
