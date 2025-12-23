// Only used for React Native
const babel = require('@babel/core')

module.exports = function startupjsLoader (source) {
  const filename = this.resourcePath
  const platform = this.query.platform

  // There is a bug in metro when BABEL_ENV is a string "undefined".
  // We have to workaround it and use NODE_ENV.
  const env = (process.env.BABEL_ENV !== 'undefined' && process.env.BABEL_ENV) || process.env.NODE_ENV

  return babel.transformSync(source, {
    filename,
    babelrc: false,
    configFile: false,
    presets: [
      [require('babel-preset-startupjs'), {
        // in Program: state.file.opts.caller.platform when used in metro
        // when used in metro - state.file.opts.caller.bundler === 'metro'
        platform,
        // in Program: state.file.opts.envName when used in metro
        env
      }],
      [require('cssxjs/babel'), { platform }]
    ]
  }).code
}
