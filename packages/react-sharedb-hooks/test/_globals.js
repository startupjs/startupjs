require('raf').polyfill(global)
global.DEBUG = process.env.DEBUG || process.env.debug

global.subscribe = null
global.serverModel = null
global.Simple = null
global.Complex = null
global.model = null
global.subDoc = null
global.subQuery = null
global.subLocal = null
global.subValue = null
global.subApi = null
global.HooksComplex = null
global.HooksSimple = null
global.useDoc = null
global.useQuery = null
global.useLocal = null
global.useValue = null
global.useApi = null

global.globalTestRenderer = null
global.globalEnzymeNode = null

export function asyncImport () {
  global.serverModel = require('./_client/initRpc')
  global.subscribe = require('../src').subscribe
  global.model = require('../src').model
  global.Simple = require('./stubs/Simple')
  global.Complex = require('./stubs/Complex')
  global.subValue = require('../src').subValue
  global.subDoc = require('../src').subDoc
  global.subQuery = require('../src').subQuery
  global.subLocal = require('../src').subLocal
  global.subApi = require('../src').subApi
  global.HooksComplex = require('./stubs/HooksComplex')
  global.HooksSimple = require('./stubs/HooksSimple')
  global.useValue = require('../src').useValue
  global.useDoc = require('../src').useDoc
  global.useQuery = require('../src').useQuery
  global.useLocal = require('../src').useLocal
  global.useApi = require('../src').useApi
}

export function cleanup () {
  if (global.globalEnzymeNode && global.globalEnzymeNode.unmount) {
    global.globalEnzymeNode.unmount()
    global.globalEnzymeNode = undefined
  }
  if (global.globalTestRenderer && global.globalTestRenderer.unmount) {
    global.globalTestRenderer.unmount()
    global.globalTestRenderer = undefined
  }
}
