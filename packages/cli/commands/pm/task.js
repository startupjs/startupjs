import { $ } from 'execa'
import { getScriptsPath } from './utils.js'

export const name = 'task <issueNumber>'
export const description = 'Create a task branch (or just switch to it if it already exists)'

export async function action (issueNumber) {
  const scriptsPath = getScriptsPath()
  await $({ shell: true, stdio: 'inherit' })`\
    ${scriptsPath} task ${issueNumber} \
  `
}
