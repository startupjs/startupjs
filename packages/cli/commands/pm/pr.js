import { $ } from 'execa'
import { scriptsPath } from './helpers.js'

export default {
  name: 'pr [issueNumber]',
  description:
    'Make PR for this task ' +
    '(or re-request review if it already exists)',
  fn: pr
}

async function pr (issueNumber) {
  if (!scriptsPath) {
    throw new Error('@startupjs/cli: \'scriptsPath\' wasn\t found')
  }

  await $({ shell: true, stdio: 'inherit' })`${scriptsPath} pr ${issueNumber}`
}
