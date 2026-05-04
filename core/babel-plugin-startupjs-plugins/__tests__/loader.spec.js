/* global jest, describe, test, expect, afterEach */
const actualFs = jest.requireActual('fs')
const actualPath = jest.requireActual('path')

// These tests mock path.relative() to return Windows-style paths so we can verify
// the loader always normalizes generated import specifiers to POSIX form.
function loadLoader ({
  existsSync = actualFs.existsSync,
  readFileSync = actualFs.readFileSync,
  readdirSync = actualFs.readdirSync,
  lstatSync = actualFs.lstatSync,
  relative = actualPath.relative,
  resolveSync = () => {
    throw Error('Module not found')
  }
} = {}) {
  jest.resetModules()
  jest.doMock('fs', () => ({
    ...actualFs,
    existsSync,
    readFileSync,
    readdirSync,
    lstatSync
  }))
  jest.doMock('path', () => ({
    ...actualPath,
    relative
  }))
  jest.doMock('resolve', () => ({ sync: resolveSync }))

  let loader
  jest.isolateModules(() => {
    loader = require('../loader')
  })
  return loader
}

afterEach(() => {
  jest.resetModules()
  jest.dontMock('fs')
  jest.dontMock('path')
  jest.dontMock('resolve')
})

describe('loader path normalization', () => {
  test('normalizes config imports to POSIX separators', () => {
    const loader = loadLoader({
      existsSync: filePath => filePath.endsWith('startupjs.config.js'),
      relative: () => '..\\startupjs.config.js'
    })

    expect(loader.getRelativeConfigImport('src/index.js', '/app'))
      .toBe('../startupjs.config.js')
  })

  test('normalizes model folder paths to POSIX separators', () => {
    const loader = loadLoader({
      relative: () => '..\\model'
    })

    expect(loader.getRelativeModelPath('src/index.js', '/app'))
      .toBe('../model')
  })

  test('normalizes model file imports to POSIX separators', () => {
    const loader = loadLoader({
      existsSync: filePath => filePath.endsWith('/model'),
      readdirSync: () => ['users.js'],
      lstatSync: () => ({ isDirectory: () => false }),
      relative: () => '..\\model\\users.js'
    })

    expect(loader.getRelativeModelImports('src/index.js', '/app'))
      .toEqual(['../model/users.js'])
  })

  test('normalizes local plugin imports to POSIX separators', () => {
    const loader = loadLoader({
      existsSync: filePath => (
        filePath === '/app/package.json' ||
        filePath === '/deps/pkg1/package.json'
      ),
      readFileSync: filePath => {
        if (filePath === '/app/package.json') {
          return JSON.stringify({
            name: 'my-app',
            dependencies: {
              startupjs: '^1.0.0',
              pkg1: '^1.0.0'
            },
            exports: {
              './plugin': './local.plugin.js'
            }
          })
        }
        if (filePath === '/deps/pkg1/package.json') {
          return JSON.stringify({
            name: '@startupjs/pkg1',
            exports: {
              './plugin': './plugin.js'
            }
          })
        }
        throw Error(`Unexpected path: ${filePath}`)
      },
      relative: () => '..\\local.plugin.js',
      resolveSync: request => {
        if (request === actualPath.join('pkg1', 'package.json')) return '/deps/pkg1/package.json'
        throw Error(`Module not found: ${request}`)
      }
    })

    expect(loader.getRelativePluginImports('src/index.js', '/app')).toEqual([
      '@startupjs/pkg1/plugin',
      '../local.plugin.js'
    ])
  })
})
