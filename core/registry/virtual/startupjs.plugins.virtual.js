// This is a default startupjs config.
//
// Babel plugin '@startupjs/babel-plugin-startupjs-plugins' will transform
// ```
// import plugins './startupjs.plugins.virtual.js'
// ```
// into a bunch of imports for each plugin found by traversing all "exports"
// in the project's 'package.json'.
//
// Example:
//   "exports": {
//     "./plugin": "./plugin.js",
//     "./advanced/plugin": "./advanced/plugin/index.js",
//
// Will be transformed into:
//   import { default as $1 } from './plugin.js'
//   import { default as $2 } from './advanced/plugin/index.js'
//   const plugins = [$1, $2]

export default []
