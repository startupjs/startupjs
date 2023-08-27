import * as queryMethods from './queryMethods.js'
import * as queryMap from './queryMap.js'
import * as friendlyNames from './friendlyNames.js'
import * as queryData from './queryData.js'
import * as racerMap from './racerMap.js'
import * as _default from './_default.js'
import { plugin as sub } from '../sub.js'

// IMPORTANT! Order matters here since plugins will be applied in this order!
//            This is why some plugins are disassembled into multiple parts
//            to achieve the desired order for a particular hook.
export default [
  // get
  queryMethods,
  queryMap,
  friendlyNames,
  queryData,

  // apply
  { apply: sub.apply },
  racerMap,

  // create
  { create: sub.create },

  // destroy
  { destroy: sub.destroy },

  // IMPORTANT! _default must always be last:
  _default
].filter(Boolean)
