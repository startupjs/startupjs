import { $ } from 'execa'
import { getScriptsPath } from './utils.js'

export const name = 'pr [issueNumber]'
export const description = 'Make PR for this task (or re-request review if it already exists)'

export async function action (issueNumber) {
  const scriptsPath = getScriptsPath()
  await $({ shell: true, stdio: 'inherit' })`
    ${scriptsPath} pr ${issueNumber}
  `
}
