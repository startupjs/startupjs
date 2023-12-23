import { $ } from 'execa'
import { scriptsPath } from './helpers.js'

export default {
  name: 'task <issueNumber>',
  description:
    'Create a task branch ' +
    '(or just switch to it if it already exists)',
  fn: task
}

async function task (issueNumber) {
  if (!scriptsPath) {
    throw new Error('@startupjs/cli: \'scriptsPath\' wasn\t found')
  }

  await $({ shell: true, stdio: 'inherit' })`${scriptsPath} task ${issueNumber}`
}
