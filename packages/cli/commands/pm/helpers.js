import path from 'path'
import { createRequire } from 'module'
import chalk from 'chalk'

const require = createRequire(import.meta.url)

let scriptsPath

try {
  scriptsPath = path.join(
    path.dirname(require.resolve('@startupjs/pm')),
    'scripts.sh'
  )
} catch (err) {
  console.error(
    `${chalk.red('@startupjs/pm package wasn\'t found.')}`
  )
}

export { scriptsPath }
