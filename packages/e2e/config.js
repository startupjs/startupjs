const path = require('path')

module.exports = {
  setupFilesAfterEnv: [path.resolve(__dirname, 'init.js')],
  testEnvironment: path.resolve(__dirname, 'environment.js'),
  testRunner: 'jest-circus/runner',
  testTimeout: 60000,
  rootDir: process.cwd(),
  testMatch: ['<rootDir>/e2e/*.e2e.js'],
  reporters: ['detox/runners/jest/streamlineReporter'],
  verbose: true
}
