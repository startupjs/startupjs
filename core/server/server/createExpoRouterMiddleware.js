import { createRequire } from 'node:module'
import { join } from 'node:path'
import { runWithRequestContext } from './requestContext.js'

export default function createExpoRouterMiddleware ({ build, projectRoot, environment }) {
  const projectRequire = createRequire(join(projectRoot, 'package.json'))
  const { createRequestHandler } = requireExpoServer(projectRequire, 'expo-server/adapter/express')
  const expoRouterMiddleware = createRequestHandler({ build, environment })

  return function startupjsExpoRouterMiddleware (req, res, next) {
    runWithRequestContext(req, res, () => {
      expoRouterMiddleware(req, res, next)
    })
  }
}

function requireExpoServer (projectRequire, id) {
  try {
    return projectRequire(id)
  } catch (err) {
    throw Error(ERRORS.missingExpoServer(id, err))
  }
}

const ERRORS = {
  missingExpoServer: (id, err) => `
    [@startupjs/server] Expo Router server output was detected, but \`${id}\` could not be loaded.
    Install \`expo-server\` in the Expo app or use Expo Router SDK 54+.

    Original error:
    ${err?.message || err}
  `
}
