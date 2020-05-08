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
  global.subscribe = require('..').subscribe
  global.model = require('..').model
  global.Simple = require('./stubs/Simple')
  global.Complex = require('./stubs/Complex')
  global.subValue = require('..').subValue
  global.subDoc = require('..').subDoc
  global.subQuery = require('..').subQuery
  global.subLocal = require('..').subLocal
  global.subApi = require('..').subApi
  global.HooksComplex = require('./stubs/HooksComplex')
  global.HooksSimple = require('./stubs/HooksSimple')
  global.useValue = require('..').useValue
  global.useDoc = require('..').useDoc
  global.useQuery = require('..').useQuery
  global.useLocal = require('..').useLocal
  global.useApi = require('..').useApi
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
