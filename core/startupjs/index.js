export { default as BASE_URL } from '@startupjs/utils/BASE_URL'
export { default as axios } from '@startupjs/utils/axios'
export * from 'teamplay'
export * from '@startupjs/hooks'
// HINT: `isomorphic` means that the code can be executed both
//        on the server and on the client
export * from '@startupjs/isomorphic-helpers'
// dummy babel macro functions for @startupjs/babel-plugin-rn-stylename-inline.
export function css (cssString) { return cssString }
export function styl (stylString) { return stylString }
// dummy pug function (it gets compiled to jsx by babel pug plugin)
export function pug (pugString) { return pugString }
export { default as StartupjsProvider } from './StartupjsProvider.js'

// loading config should be performed first
export { default as __dummyLoadConfig } from '@startupjs/registry/loadStartupjsConfig.auto'

// init client at the very end. This is hacky solution to handle import loops
export { default as __dummyInitClient } from './initClient.auto.js'
