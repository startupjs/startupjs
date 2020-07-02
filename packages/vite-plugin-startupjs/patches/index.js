const patchCss = require('./patchCss')
const patchEsBuild = require('./patchEsBuild')
// const patchBeforeTransforms = require('./patchBeforeTransforms')
const patchResolver = require('./patchResolver')

patchCss()
patchEsBuild()
// patchBeforeTransforms()
patchResolver()

module.exports = function dummyNoTreeShaking () {}
