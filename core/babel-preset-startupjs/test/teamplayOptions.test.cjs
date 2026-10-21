const { test } = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')
const babel = require('@babel/core')

const PRESET = path.join(__dirname, '..', 'index.js')

// babel-plugin-teamplay's options, as the preset passes them for an app file
function teamplayPluginOptions (presetOptions) {
  const { plugins } = babel.loadOptions({
    filename: path.join(__dirname, 'App.js'),
    babelrc: false,
    configFile: false,
    presets: [[PRESET, presetOptions]]
  })
  const teamplay = plugins.filter(plugin => plugin.options && 'fallbackModelsFolders' in plugin.options)
  assert.equal(teamplay.length, 1)
  return teamplay[0].options
}

test('passes the `teamplay` option to babel-plugin-teamplay', () => {
  const options = teamplayPluginOptions({ teamplay: { reactCompiler: 'full', dollarCalls: 'warn' } })
  assert.equal(options.reactCompiler, 'full')
  assert.equal(options.dollarCalls, 'warn')
  assert.equal(options.autoInit, false)
  assert.equal(options.clientOnly, true)
})

test('without it, babel-plugin-teamplay gets only the preset\'s own options', () => {
  const options = teamplayPluginOptions({})
  assert.equal('reactCompiler' in options, false)
  assert.equal('dollarCalls' in options, false)
})
