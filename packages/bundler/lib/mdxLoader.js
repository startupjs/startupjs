const mdx = require('@mdx-js/mdx')

const DEFAULT_MDX_RENDERER = `
/** @jsxRuntime automatic */
import React from 'react'
import { mdx } from '@mdx-js/react'
`

module.exports = function mdxLoader (source) {
  source = mdx.sync(source)
  source = DEFAULT_MDX_RENDERER + '\n' + source
  return source
}
