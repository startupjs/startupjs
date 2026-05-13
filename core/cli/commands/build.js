import { $ } from 'execa'
import { existsSync, writeFileSync } from 'fs'
import { join } from 'path'

export const name = 'build'
export const description = 'Build web bundle for production usage'

export async function action ({ inspect }) {
  await $({
    stdio: 'inherit',
    env: { IS_BUILD: 'true' }
  })`\
    npx expo export -p web \
  `

  markExpoServerBuildAsCommonJs()
}

function markExpoServerBuildAsCommonJs () {
  const serverBuildPath = join(process.cwd(), 'dist/server')
  if (!existsSync(join(serverBuildPath, '_expo/routes.json'))) return

  writeFileSync(
    join(serverBuildPath, 'package.json'),
    JSON.stringify({ type: 'commonjs' }, null, 2) + '\n'
  )
}
