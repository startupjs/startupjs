const upstreamTransformer = require('metro-react-native-babel-transformer')
const stylusToCssLoader = require('./stylusToCssLoader')
const cssToReactNativeLoader = require('./cssToReactNativeLoader')
const svgTransformer = require('react-native-svg-transformer')
const mdx = require('@mdx-js/mdx')
const mdxExamplesLoader = require('./mdxExamplesLoader')
const replaceObserverLoader = require('./replaceObserverLoader')
const callLoader = require('./callLoader')

const DEFAULT_MDX_RENDERER = `
import React from 'react'
import { mdx } from '@mdx-js/react'
`

module.exports.transform = function ({ src, filename, options = {} }) {
  const { platform } = options
  if (/\.styl$/.test(filename)) {
    src = callLoader(stylusToCssLoader, src, filename, { platform })
    src = callLoader(cssToReactNativeLoader, src, filename)
    return upstreamTransformer.transform({ src, filename, options })
  } else if (/\.css$/.test(filename)) {
    src = callLoader(cssToReactNativeLoader, src, filename)
    return upstreamTransformer.transform({ src, filename, options })
  } else if (/\.svg$/.test(filename)) {
    return svgTransformer.transform({ src, filename, options })
  } else if (/\.[cm]?jsx?$/.test(filename) && /['"]startupjs['"]/.test(src)) {
    // Fix Fast Refresh to work with observer() decorator.
    // For details view ./replaceObserverLoader.js
    src = src.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:^\s*\/\/(?:.*)$)/gm, '')
    src = callLoader(replaceObserverLoader, src, filename)
    return upstreamTransformer.transform({ src, filename, options })
  } else if (/\.mdx?$/.test(filename)) {
    src = callLoader(mdxExamplesLoader, src, filename)
    src = mdx.sync(src)
    src = DEFAULT_MDX_RENDERER + '\n' + src
    return upstreamTransformer.transform({ src, filename, options })
  } else {
    return upstreamTransformer.transform({ src, filename, options })
  }
}
