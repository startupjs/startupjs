// This exports compile-time features information about the project.
//
// Babel plugin '@startupjs/babel-plugin-startupjs-plugins' will transform
// ```
// import features from './startupjs.features.virtual.js'
// ```
// into the features information which is publicly available at runtime everywhere
// in all envs - client, server, build.
//
// Default features information exported here is defined for client-only usage of startupjs
// for cases when startupjs is just plugged in directly into another project
// just as a client-side library.
//
// This features information will be available in ROOT_MODULE.options (it will just be merged with other options)

// Possible values:
//   enableServer {Boolean} - `true` if 'server' folder exists with at least one file in it
export default {}
