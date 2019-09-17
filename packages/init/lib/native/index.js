// React Native requires manual configuration of the ShareDB client.
// Here we patch the connection options to work in RN environment.

// Make RN behave like a browser to trick Racer
import mockBrowser from './mockBrowser'

import ShareDB from 'sharedb/lib/client'
import commonInit from '../util/common'
import connectModel from '../util/connectModel'
import patchRacerHighway from './patchRacerHighway'
import axios from 'axios'

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

  // This module is actually pure side-effects, so we force
  // its usage to prevent tree-shaking algos from removing the import
  mockBrowser()

  axios.defaults.baseURL = options.baseUrl
  patchRacerHighway(options.baseUrl)
  commonInit(ShareDB, options)
  connectModel()
}
