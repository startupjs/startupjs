const { infon } = require('./log')
const postLinkAndroid = require('./postLinkAndroid')
const postLinkIOS = require('./postLinkIOS')

module.exports = function link () {
  postLinkAndroid()
  postLinkIOS()
  infon('startupjs link is completed. Thank you for using startupjs!\n\n')
}
