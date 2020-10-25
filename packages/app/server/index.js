export { default as initApp } from './initApp'

// TODO: DEPRECATED! Remove in a future version
export function initUpdateApp () {
  throw Error(
    '[@startupjs/app] app critical version API has changed. ' +
    'Please update it following the new readme from ' +
    'https://github.com/startupjs/startupjs/tree/master/packages/app'
  )
}
