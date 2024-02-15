import fs from 'fs'
import path from 'path'
import { $ } from 'execa'
import { getScriptsPath } from './utils.js'

export const name = 'init-pm'
export const description = 'Create a new project on github from template'

export async function action () {
  const scriptsPath = getScriptsPath()

  // TODO: maybe change this to use 'sh' binary directly and remove `shell: true`
  await $({ shell: true, stdio: 'inherit' })`\
    ${scriptsPath} init-pm \
  `

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
