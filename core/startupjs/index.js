import React from 'react'

export { BASE_URL } from '@startupjs/utils/BASE_URL'
export { default as axios } from '@startupjs/utils/axios'
export * from 'teamplay'
export * from 'cssxjs'
export * from '@startupjs/hooks'
// HINT: `isomorphic` means that the code can be executed both
//        on the server and on the client
export * from '@startupjs/isomorphic-helpers'

// wrap serverOnly around the value to remove it from the client bundle
// (it will be replaced with `undefined` on the client by the babel-plugin-eliminator)
export function serverOnly (value) { return value }

export { default as StartupjsProvider } from './StartupjsProvider.js'

// loading config should be performed first
export { default as __dummyLoadConfig } from '@startupjs/registry/loadStartupjsConfig.auto'

// COMPAT-ONLY legacy hook expected by older LMS code and packages built against
// the historic startupjs surface. On web and in the current Expo migration we do
// not have a root-level back-press integration here, so the compat contract is a
// safe no-op hook. This keeps old imports working without reintroducing the old
// runtime behavior.
export function useBackPress () {}

// COMPAT-ONLY stable component id helper expected by older Startupjs libraries.
// Keep it ref-based to preserve a hook-safe, runtime-agnostic compat contract.
let _componentIdCounter = 0
export function useComponentId (prefix = 'c') {
  const ref = React.useRef()
  if (!ref.current) ref.current = `${prefix}_${++_componentIdCounter}`
  return ref.current
}
