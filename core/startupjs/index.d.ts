export { BASE_URL } from '@startupjs/utils/BASE_URL'
export { default as axios } from '@startupjs/utils/axios'
export * from 'teamplay'
export * from '@startupjs/hooks'
// HINT: `isomorphic` means that the code can be executed both
//        on the server and on the client
export * from '@startupjs/isomorphic-helpers'
export { getSessionData, setSessionData } from '@startupjs/server/utils/clientSessionData'
export { default as auth } from '@startupjs/server/utils/clientAuth'
// dummy babel macro functions for @startupjs/babel-plugin-rn-stylename-inline
export function css (css: TemplateStringsArray): any
export function styl (styl: TemplateStringsArray): any
export function pug (pug: TemplateStringsArray): any

export { default as StartupjsProvider } from './StartupjsProvider.js'
