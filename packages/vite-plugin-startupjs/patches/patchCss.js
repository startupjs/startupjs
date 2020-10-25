const viteUtils = require('vite/dist/utils/cssUtils')

// Patch to ignore regular styl files
viteUtils.cssPreprocessLangRE = new RegExp(
  viteUtils.cssPreprocessLangRE.source.replace('styl|', '')
)

module.exports = function dummyNoTreeShaking () {}
