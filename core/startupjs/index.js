export { BASE_URL } from '@startupjs/utils/BASE_URL'
export { default as axios } from '@startupjs/utils/axios'
export * from 'teamplay'
export * from 'cssxjs'
export * from '@startupjs/hooks'
// HINT: `isomorphic` means that the code can be executed both
//        on the server and on the client
export * from '@startupjs/isomorphic-helpers'
export { getSessionData, setSessionData, deleteSessionData, onInitSession } from '@startupjs/server/utils/clientSessionData'
export { default as login } from '@startupjs/server/utils/clientLogin'
export { default as logout } from '@startupjs/server/utils/clientLogout'

// wrap serverOnly around the value to remove it from the client bundle
// (it will be replaced with `undefined` on the client by the babel-plugin-eliminator)
export function serverOnly (value) { return value }

export { default as StartupjsProvider } from './StartupjsProvider.js'

// loading config should be performed first
export { default as __dummyLoadConfig } from '@startupjs/registry/loadStartupjsConfig.auto'
