import { join, dirname } from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export function getScriptsPath () {
  return join(dirname(require.resolve('@startupjs/pm')), 'scripts.sh')
}
