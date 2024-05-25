// Transform .svg files into React components.
// This is only used in Metro since on webpack we use @svgr/webpack for the same purpose.
// ref: https://github.com/kristerkari/react-native-svg-transformer/blob/master/index.js
const { dirname } = require('path')
const { resolveConfig, transform } = require('@svgr/core')

const defaultSVGRConfig = {
  native: true,
  plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            inlineStyles: {
              onlyMatchedOnce: false
            },
            removeViewBox: false,
            removeUnknownsAndDefaults: false,
            convertColors: false
          }
        }
      }
    ]
  }
}

module.exports = asyncLoader(async function asyncSvgLoader (source) {
  const filename = this.resourcePath
  const config = {
    ...defaultSVGRConfig,
    ...await resolveConfig(dirname(filename))
  }
  return transform(source, config)
})

// webpack loader must return undefined, so we can't make the actual loader function async
function asyncLoader (loader) {
  return function (...args) {
    const callback = this.async()
    loader.call(this, ...args).then(result => callback(null, result), callback)
  }
}
