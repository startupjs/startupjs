import { ROOT_MODULE as MODULE } from '@startupjs/registry'
import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import methodOverride from 'method-override'
import hsts from 'hsts'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { createRequire } from 'module'
import { _createMiddleware } from './createMiddleware.js'
import renderApp from '../renderApp/index.js'
import renderError from '../renderError/index.js'

const WWW_REGEXP = /www\./

export default async function createExpress ({ backend, session, channel, options = {} }) {
  const expressApp = express()
  const expoClientPath = getExpoClientPath(options)
  const expoServerPath = getExpoServerPath(options)
  const expoRouterServer = getExpoRouterServer(options, expoServerPath)

  // Required to be able to determine whether the protocol is 'http' or 'https'
  expressApp.enable('trust proxy')

  // ----------------------------------------------------->    logs    <#
  MODULE.hook('logs', expressApp)

  function shouldCompress (req, res) {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false
    }

    // fallback to standard filter function
    return compression.filter(req, res)
  }

  expressApp
    .use(compression({ filter: shouldCompress }))
    .use('/healthcheck', (req, res) => res.status(200).send('OK'))

  if (process.env.FORCE_HTTPS_REDIRECT) {
    // Redirect http to https
    expressApp.use((req, res, next) => {
      if (req.protocol !== 'https') {
        return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`)
      }
      next()
    })
    // enforce https for 180 days
    expressApp.use(hsts({ maxAge: 15552000 }))
  }

  // get rid of 'www.' from url
  expressApp.use((req, res, next) => {
    if (WWW_REGEXP.test(req.headers.host)) {
      const newHost = req.headers.host.replace(WWW_REGEXP, '')
      return res.redirect(301, `${req.protocol}://${newHost}${req.originalUrl}`)
    }
    next()
  })

  // host static files
  MODULE.hook('static', expressApp)
  expressApp.use(express.static(expoClientPath || options.publicPath, { maxAge: '1h', index: false }))
  if (!options.isExpo) {
    expressApp.use('/build/client', express.static(options.dirname + '/build/client', { maxAge: '1h' }))
  }

  expressApp.use(cookieParser())
  expressApp.use(methodOverride())

  const startupjsMiddleware = await _createMiddleware({ backend, session, channel, options })
  expressApp.use(startupjsMiddleware)

  if (expoRouterServer.enabled) {
    const { default: createExpoRouterMiddleware } = await import('./createExpoRouterMiddleware.js')
    expressApp.use(createExpoRouterMiddleware({
      build: expoRouterServer.path,
      projectRoot: options.dirname,
      environment: options.environment
    }))
  }

  // render the single page client app for any route which wasn't handled by the server routes
  if (options.isExpo) {
    if (!expoRouterServer.enabled) {
      const indexFilePath = getExpoIndexFilePath(options, { clientPath: expoClientPath, serverPath: expoServerPath })
      if (indexFilePath) {
        const indexFile = readFileSync(indexFilePath, 'utf8')
        expressApp.use((req, res, next) => { res.status(200).send(indexFile) })
      }
    }
  } else {
    expressApp.use(renderApp(options))
  }

  expressApp.use(function (err, req, res, next) {
    if (err.name === 'MongoError' && err.message === 'Topology was destroyed') {
      process.exit()
    }
    next(err)
  })

  expressApp.use((options.error || renderError)(options))

  return expressApp
}

function getExpoClientPath (options) {
  if (!options.isExpo) return
  if (options.expoClientBuildPath) return options.expoClientBuildPath
  const clientPath = join(options.publicPath, 'client')
  if (existsSync(clientPath)) return clientPath
}

function getExpoServerPath (options) {
  if (!options.isExpo) return
  if (options.expoServerBuildPath) return options.expoServerBuildPath
  const serverPath = join(options.publicPath, 'server')
  if (existsSync(join(serverPath, '_expo', 'routes.json'))) return serverPath
}

function getExpoIndexFilePath (options, { clientPath, serverPath }) {
  const indexFilePath = join(clientPath || options.publicPath, 'index.html')
  if (existsSync(indexFilePath)) return indexFilePath
  if (serverPath) return getExpoServerRootHtmlPath(serverPath)
}

function getExpoServerRootHtmlPath (serverPath) {
  const routes = readExpoServerRoutes(serverPath)
  const rootRoute = routes.htmlRoutes?.find(route => routeMatchesPath(route, '/'))
  const rootHtmlPath = getExpoHtmlRoutePath(serverPath, rootRoute)
  if (rootHtmlPath) return rootHtmlPath

  const notFoundHtmlPath = getExpoHtmlRoutePath(serverPath, routes.notFoundRoutes?.[0])
  if (notFoundHtmlPath) return notFoundHtmlPath
}

function readExpoServerRoutes (serverPath) {
  try {
    return JSON.parse(readFileSync(join(serverPath, '_expo', 'routes.json'), 'utf8'))
  } catch {
    return {}
  }
}

function routeMatchesPath (route, pathname) {
  try {
    return new RegExp(route.namedRegex).test(pathname)
  } catch {
    return false
  }
}

function getExpoHtmlRoutePath (serverPath, route) {
  if (!route?.page) return
  const filePath = join(serverPath, route.page.replace(/^\//, '') + '.html')
  if (existsSync(filePath)) return filePath
}

function getExpoRouterServer (options, serverPath) {
  if (!serverPath) return { enabled: false }

  const packageJsonPath = join(options.dirname, 'package.json')
  const projectRequire = createRequire(packageJsonPath)
  const webOutput = getExpoWebOutput(options, projectRequire)

  if (webOutput !== 'server') {
    warnIgnoredExpoServer(serverPath, webOutput)
    return { enabled: false }
  }

  const packageJson = readProjectPackageJson(packageJsonPath)

  if (!hasPackageDependency(packageJson, 'expo-server')) {
    warnMissingExpoServer(serverPath, 'the project package.json does not list `expo-server`')
    return { enabled: false }
  }

  try {
    projectRequire.resolve('expo-server/adapter/express')
  } catch {
    warnMissingExpoServer(serverPath, '`expo-server/adapter/express` could not be resolved')
    return { enabled: false }
  }

  return {
    enabled: true,
    path: serverPath
  }
}

function getExpoWebOutput (options, projectRequire) {
  try {
    const { getConfig } = projectRequire('expo/config')
    return getConfig(options.dirname, { skipSDKVersionRequirement: true })?.exp?.web?.output
  } catch {
    return readExpoWebOutputFromAppJson(join(options.dirname, 'app.json'))
  }
}

function readExpoWebOutputFromAppJson (appJsonPath) {
  try {
    const appJson = JSON.parse(readFileSync(appJsonPath, 'utf8'))
    return appJson.expo?.web?.output || appJson.web?.output
  } catch {
  }
}

function readProjectPackageJson (packageJsonPath) {
  try {
    return JSON.parse(readFileSync(packageJsonPath, 'utf8'))
  } catch {
    return {}
  }
}

function hasPackageDependency (packageJson, dependency) {
  return Boolean(
    packageJson.dependencies?.[dependency] ||
    packageJson.devDependencies?.[dependency] ||
    packageJson.optionalDependencies?.[dependency] ||
    packageJson.peerDependencies?.[dependency]
  )
}

function warnMissingExpoServer (serverPath, reason) {
  console.warn(ERRORS.missingExpoServer(serverPath, reason))
}

function warnIgnoredExpoServer (serverPath, webOutput) {
  console.warn(ERRORS.ignoredExpoServer(serverPath, formatExpoWebOutput(webOutput)))
}

function formatExpoWebOutput (webOutput) {
  if (webOutput == null) return 'not configured'
  return `\`${webOutput}\``
}

const ERRORS = {
  ignoredExpoServer: (serverPath, webOutput) => `
    [@startupjs/server] Expo Router server output was detected at \`${serverPath}\`, but Expo web output is ${webOutput} instead of \`server\`.
    StartupJS will skip Expo Router API routes and middleware for this build.
    Remove stale \`dist/server\` output or set \`expo.web.output\` to \`server\` to enable Expo Router server output.
  `,
  missingExpoServer: (serverPath, reason) => `
    [@startupjs/server] Expo Router server output was detected at \`${serverPath}\`, but ${reason}.
    StartupJS will skip Expo Router API routes and middleware for this build.
    Install \`expo-server\` in the app to enable Expo Router server output.
  `
}
