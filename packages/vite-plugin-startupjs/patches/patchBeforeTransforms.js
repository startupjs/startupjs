const serverPluginJson = require('vite/dist/server/serverPluginJson')
const { createServerTransformPlugin } = require('vite/dist/transform')

const _beforeTransforms = []

const _origJsonPlugin = serverPluginJson.jsonPlugin
serverPluginJson.jsonPlugin = function () {
  _origJsonPlugin.apply(this, arguments)
  for (const transform of _beforeTransforms) {
    transform.apply(this, arguments)
  }
}

module.exports = exports = function dummyNoTreeShaking () {}

exports.addBeforeTransforms = function addBeforeTransforms (transforms = []) {
  const fns = transforms.map(fn => createServerTransformPlugin([fn]))
  _beforeTransforms.push(...fns)
}
