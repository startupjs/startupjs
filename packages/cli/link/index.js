const { infon } = require('./log')
const postLinkAndroid = require('./postLinkAndroid')

module.exports = function link () {
  postLinkAndroid()
  infon('startupjs link is completed. Thank you for using startupjs!\n\n')
}
