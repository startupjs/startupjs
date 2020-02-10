const merge = require('lodash/merge')
const getBaseConfig = require('./base')
const getComponentsConfig = require('./components')

module.exports = function (config = {}) {
  const baseConfig = getBaseConfig(config.pallete)
  const _config = merge({}, baseConfig, config)
  const componentsConfig = getComponentsConfig(_config)
  return merge({}, componentsConfig, _config)
}
