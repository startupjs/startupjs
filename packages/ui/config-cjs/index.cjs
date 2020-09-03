const merge = require('lodash/merge')

module.exports = function (config = {}) {
  return merge({}, config)
}
