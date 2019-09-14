const config = require('startupjs/bundler').babelConfig

// Override default babel config here.

// Default plugins are used for all targets - native, web and server:
// - config.plugins

// There are also the following target-specific envs with their own presets and plugins:
// - config.env.development         // native client dev
// - config.env.production          // native client prod
// - config.env.web_development     // web client dev
// - config.env.web_production      // web client prod
// - config.env.server              // server dev/prod

module.exports = config
