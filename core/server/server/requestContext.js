import { AsyncLocalStorage } from 'node:async_hooks'

const REQUEST_CONTEXT_SYMBOL = Symbol.for('startupjs.server.requestContext')
const requestContext = globalThis[REQUEST_CONTEXT_SYMBOL] ??= new AsyncLocalStorage()

export function runWithRequestContext (req, res, fn) {
  return requestContext.run({ req, res }, fn)
}

export function getRequestContext () {
  return requestContext.getStore()
}

export function getServerRequest () {
  return getRequestContext()?.req
}

export function getServerResponse () {
  return getRequestContext()?.res
}

export function getServerSession () {
  return getServerRequest()?.session
}
