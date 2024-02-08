// Make ShareDB client and Racer client work in React Native and in Webpack
import dummyMockBrowserify from '@startupjs/utils/mockBrowserify'

;(_ => _)([dummyMockBrowserify]) // prevent dead-code elimination

export { default as BASE_URL } from '@startupjs/utils/BASE_URL'
export { default as axios } from '@startupjs/utils/axios'
export * from '@startupjs/react-sharedb'
export { default as $, signal } from '@startupjs/signals'
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
export { default as t } from '@startupjs/i18n/client/t.js'

// init client at the very end. This is hacky solution to handle import loops
export { default as dummyInitClient } from './initClient.auto.js'
