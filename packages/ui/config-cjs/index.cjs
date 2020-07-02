const merge = require('lodash/merge')
const getBaseConfig = require('./base.cjs')
const getComponentsConfig = require('./components.cjs')

module.exports = function (config = {}) {
  const baseConfig = getBaseConfig(config.pallete)
  const _config = merge({}, baseConfig, config)
  const componentsConfig = getComponentsConfig(_config)
  return merge({}, componentsConfig, _config)
}
