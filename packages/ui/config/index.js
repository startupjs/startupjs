const merge = require('lodash/merge')
const baseConfig = require('./base')
const getComponentsConfig = require('./components')

module.exports = function (config) {
  const _config = merge({}, baseConfig, config)
  const componentsConfig = getComponentsConfig(_config)
  return merge({}, componentsConfig, _config)
}
