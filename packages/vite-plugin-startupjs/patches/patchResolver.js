const resolver = require('vite/dist/resolver')

resolver.supportedExts.unshift('.web.js')

module.exports = function dummyNoTreeShaking () {}
