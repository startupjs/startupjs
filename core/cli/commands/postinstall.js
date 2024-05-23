import { $ } from 'execa'
import { join, dirname, relative } from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export const name = 'postinstall'
export const description = 'Run startupjs postinstall scripts'

export async function action () {
  let patchesPath = join(dirname(require.resolve('@startupjs/patches')), 'patches')
  // patch-package requires the path to be relative
  patchesPath = relative(process.cwd(), patchesPath)
  await $({ stdio: 'inherit' })`\
    npx patch-package --patch-dir ${patchesPath} \
  `
}
