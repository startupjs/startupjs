import { $ } from 'execa'
import path from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
let PATCHES_DIR

try {
  PATCHES_DIR = path.join(
    path.dirname(require.resolve('@startupjs/patches')),
    'patches'
  )
  // patch-package requires the path to be relative
  PATCHES_DIR = path.relative(process.cwd(), PATCHES_DIR)
} catch (err) {
  console.error(err)
  console.error('ERROR!!! Patches packages not found. Falling back to local patches folder')
  PATCHES_DIR = './patches'
}

export default {
  name: 'postinstall',
  description: 'Run startupjs postinstall scripts',
  fn: postinstall
}

function postinstall () {
  $({ stdio: 'inherit' })`npx patch-package --patch-dir ${PATCHES_DIR}`
}
