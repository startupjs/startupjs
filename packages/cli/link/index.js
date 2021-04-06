const { infon } = require('./log')
const postLinkAndroid = require('./postLinkAndroid')
const oneSignalLinker = require('./oneSignalLinker')

module.exports = function link (options = {}) {
  // default case, when there is no flags
  if (!Object.keys(options).length) {
    postLinkAndroid()
    return endLinking()
  }

  const { standart, oneSignal } = options

  if (standart) {
    postLinkAndroid()
  }
  if (oneSignal) {
    oneSignalLinker()
  }
  endLinking()
}

function endLinking () {
  infon('startupjs link is completed. Thank you for using startupjs!\n\n')
}
