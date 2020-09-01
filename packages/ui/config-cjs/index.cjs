const merge = require('lodash/merge')
const getBaseConfig = require('./base.cjs')

module.exports = function (config = {}) {
  const baseConfig = getBaseConfig(config.pallete)
  const _config = merge({}, baseConfig, config)
  return merge({}, _config)
}
