// React Native requires manual configuration of the ShareDB client.
// Here we patch the connection options to work in RN environment.

// Make RN behave like a browserify bundle to trick Racer and ShareDB
// IMPORTANT: This must be called before any calls to ShareDB or Racer on the client
import mockBrowserify from '@startupjs/utils/mockBrowserify'

import ShareDB from 'sharedb/lib/client'
import axios from 'axios'
import commonInit from '../util/common'
import connectModel from '../util/connectModel'
import patchRacerHighway from './patchRacerHighway'

const DEFAULT_BASE_URL = 'http://127.0.0.1:3000'

const NO_BASE_URL_WARN = `
  !!!WARNING!!! baseUrl option is not specified.
  Defaulting to http://127.0.0.1:3000

  StartupJS on React Native must know baseUrl of the server to connect to.

  IMPORTANT!!! You must provide proper baseUrl in production. Your app
  won't be able to automatically find out the server IP address.
`

export default (options = {}) => {
  if (!options.baseUrl) {
    console.warn(NO_BASE_URL_WARN)
    options.baseUrl = DEFAULT_BASE_URL
  }

  axios.defaults.baseURL = options.baseUrl
  patchRacerHighway(options.baseUrl)
  commonInit(ShareDB, options)
  for (const plugin of options.plugins || []) {
    plugin(options)
  }
  connectModel()
}

// This module is actually pure side-effects, so we force
// its usage to prevent tree-shaking algos from removing the import
mockBrowserify()
