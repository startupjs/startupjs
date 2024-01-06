// TODO: experiment with trying to combine all startupjs-related babel plugins into one preset
// NOTE: this is used by ./metro-babel-transformer.js
// Following is an experiment for combining all startupjs-related babel plugins into one preset
// and running it all together in one babel transform.
// The 'babel-preset-startupjs/full' preset also does check for the magic libraries within
// babel itself through the skippablePreset.js hack.
// Drawbacks of this approach:
//   it still requires running transformation separately from the underlying expo/metro babel transform
//   and just putting this preset into babel config doesn't work.

// Only used for React Native
const babel = require('@babel/core')

module.exports = function startupjsFullLoader (source) {
  const filename = this.resourcePath
  const platform = this.query.platform

  const envs = this.query.envs
  if (!envs) throw Error("startupjsLoader: envs not provided (for example ['client', 'isomorphic'])")

  // There is a bug in metro when BABEL_ENV is a string "undefined".
  // We have to workaround it and use NODE_ENV.
  const env = (process.env.BABEL_ENV !== 'undefined' && process.env.BABEL_ENV) || process.env.NODE_ENV

  return babel.transformSync(source, {
    filename,
    babelrc: false,
    configFile: false,
    presets: [
      [require('babel-preset-startupjs/full'), {
        platform,
        env,
        envs
      }]
    ]
  }).code
}
