import { $ } from 'execa'
import { createRequire } from 'module'
import { existsSync, readFileSync, writeFileSync } from 'fs'
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
  if (getExpoWebOutput(process.cwd()) !== 'server') return

  const serverBuildPath = join(process.cwd(), 'dist/server')
  if (!existsSync(join(serverBuildPath, '_expo/routes.json'))) return

  writeFileSync(
    join(serverBuildPath, 'package.json'),
    JSON.stringify({ type: 'commonjs' }, null, 2) + '\n'
  )
}

function getExpoWebOutput (root) {
  try {
    const projectRequire = createRequire(join(root, 'package.json'))
    const { getConfig } = projectRequire('expo/config')
    return getConfig(root, { skipSDKVersionRequirement: true })?.exp?.web?.output
  } catch {
    return readExpoWebOutputFromAppJson(join(root, 'app.json'))
  }
}

function readExpoWebOutputFromAppJson (appJsonPath) {
  try {
    const appJson = JSON.parse(readFileSync(appJsonPath, 'utf8'))
    return appJson.expo?.web?.output || appJson.web?.output
  } catch {
  }
}
