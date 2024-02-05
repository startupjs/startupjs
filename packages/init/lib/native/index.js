// React Native requires manual configuration of the ShareDB client.
// Here we patch the connection options to work in RN environment.

// Make RN behave like a browserify bundle to trick Racer and ShareDB
// IMPORTANT: This must be called before any calls to ShareDB or Racer on the client
import mockBrowserify from '@startupjs/utils/mockBrowserify'

import DEFAULT_BASE_URL from '@startupjs/utils/BASE_URL'
import isDevelopment from '@startupjs/utils/isDevelopment'
import isExpo from '@startupjs/utils/isExpo'
import isWeb from '@startupjs/utils/isWeb'
import axios from '@startupjs/utils/axios'
import { ROOT_MODULE as MODULE } from '@startupjs/registry'
import ShareDB from 'sharedb/lib/client'
import projectAxios from 'axios'
import commonInit from '../util/common'
import connectModel from '../util/connectModel'

const NO_BASE_URL_WARN = `
  !!! WARNING !!! baseUrl option is not specified.
  Defaulting to ${DEFAULT_BASE_URL}

  !!! IMPORTANT !!!
  This might only work fine in development mode or if you are on Web.
  In order for the app to work in production on React Native (iOS and Android),
  you MUST explicitly provide the baseUrl option because the app can't guess it.
  The simplest way to do it is to create a file \`.env.production\`
  and put \`BASE_URL=https://mydomain.com\` there.
`

export default (options = {}) => {
  options.baseUrl ??= MODULE.options.baseUrl

  if (!options.baseUrl) {
    if (!(isWeb || (isExpo && isDevelopment))) console.warn(NO_BASE_URL_WARN)
    options.baseUrl = DEFAULT_BASE_URL
  }

  axios.defaults.baseURL = options.baseUrl

  // Patch project-level axios.
  // People might be using it directly in their project already.
  // This also works fine if there is no axios on the project level.
  // We specify it in this package as a peerDependency,
  // while @startupjs/utils/axios specifies it as a dependency,
  // so it's guaranteed to be installed in the project.
  projectAxios.defaults.baseURL = options.baseUrl

  globalThis.__startupjsChannelOptions = {
    baseUrl: options.baseUrl,
    // In dev we embed startupjs server as middleware into Metro server itself.
    // We have to use XHR since there is no way to easily access Metro's WebSocket endpoints.
    // In production we run our own server and can use WebSocket without any problems.
    forceXhrFallback: isDevelopment
  }

  commonInit(ShareDB, options)
  for (const plugin of options.plugins || []) {
    plugin(options)
  }

  // Connect model to the server
  // TODO: Connect model ONLY if startupjs server exists
  if (MODULE.options.server) connectModel()
}

// This module is actually pure side-effects, so we force
// its usage to prevent tree-shaking algos from removing the import
mockBrowserify()
