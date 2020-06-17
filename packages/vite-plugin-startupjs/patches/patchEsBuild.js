const esbuildService = require('vite/dist/esbuildService')

// HACK: Monkey patch extensions processed by esbuild
// TODO: implement PR
esbuildService.tjsxRE = /\.(tsx?|jsx?|mdx?|cjs|mjs)$/

// HACK: Monkey patch esbuild transform to custom handle .mdx extension
// TODO: implement PR
const origTransform = esbuildService.transform
esbuildService.transform = async function (src, file, options = {}, ...args) {
  if (/\.mdx$/.test(file)) {
    options = {
      ...options,
      loader: 'jsx',
      jsxFactory: 'mdx'
    }
  }
  if (/\.[cm]?js$/.test(file)) {
    options = {
      ...options,
      loader: 'jsx'
    }
  }
  // Move into separate transformer
  let match = src.match(/\/\*\s*@jsx\s+([^\s*]+)\s*\*\//)
  match = match && match[1]
  if (match) {
    options = {
      ...options,
      jsxFactory: match
    }
  }
  return origTransform.call(this, src, file, options, ...args)
}

module.exports = function dummyNoTreeShaking () {}
