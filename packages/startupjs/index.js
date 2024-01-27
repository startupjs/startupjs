// Make ShareDB client and Racer client work in React Native and in Webpack
import dummyMockBrowserify from '@startupjs/utils/mockBrowserify'
import dummyLoadConfig from '@startupjs/registry/loadStartupjsConfig.auto'
// - init connection to ShareDB server
// - setup baseUrl for axios
// - add rich-text support to ShareDB
import dummyInit from '@startupjs/init/client.auto'

;(_ => _)([dummyInit, dummyLoadConfig, dummyMockBrowserify]) // prevent dead-code elimination

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
