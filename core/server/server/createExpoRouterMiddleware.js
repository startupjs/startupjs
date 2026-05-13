import { createRequire } from 'node:module'
import replayRequestBody from './replayRequestBody.js'
import { runWithRequestContext } from './requestContext.js'

const require = createRequire(import.meta.url)

export default function createExpoRouterMiddleware ({ build, environment }) {
  const { createRequestHandler } = requireExpoServer('expo-server/adapter/express')
  const expoRouterMiddleware = createRequestHandler({ build, environment })

  return function startupjsExpoRouterMiddleware (req, res, next) {
    runWithRequestContext(req, res, () => {
      expoRouterMiddleware(replayRequestBody(req), res, next)
    })
  }
}

function requireExpoServer (id) {
  try {
    return require(id)
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
