const { infon } = require('./log')
const postLinkAndroid = require('./postLinkAndroid')

module.exports = function link (options = {}) {
  // default case, when there is no flags
  if (!Object.keys(options).length) {
    postLinkAndroid()
    return endLinking()
  }

  const { standart } = options

  if (standart) {
    postLinkAndroid()
  }
  endLinking()
}

function endLinking () {
  infon('startupjs link is completed. Thank you for using startupjs!\n\n')
}
