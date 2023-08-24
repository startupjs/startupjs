import * as queryMethods from './queryMethods'
import * as queryMap from './queryMap'
import * as friendlyNames from './friendlyNames'
import * as queryData from './queryData'
import * as _default from './_default'

// IMPORTANT! Order matters here since plugins will be applied in this order!
export default [
  queryMethods,
  queryMap,
  friendlyNames,
  queryData,
  // IMPORTANT! _default must always be last:
  _default
].filter(Boolean)
