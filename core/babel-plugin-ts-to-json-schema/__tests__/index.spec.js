const { readFileSync } = require('fs')
const { join } = require('path')
const pluginTester = require('babel-plugin-tester').default
const plugin = require('../index')
const { name: pluginName } = require('../package.json')
const FIXTURES_PATH = join(__dirname, '../fixtures')
const TEST_FILE_PATH = join(FIXTURES_PATH, 'Test.tsx')

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  babelOptions: {
    plugins: [
      ['@babel/plugin-syntax-typescript', { isTSX: true }]
    ],
    filename: TEST_FILE_PATH
  },
  tests: {
    'Transforms TS interface to JSON schema': readFileSync(TEST_FILE_PATH, 'utf8')
  }
})
