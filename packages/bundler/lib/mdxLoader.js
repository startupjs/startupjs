const mdx = require('@mdx-js/mdx')

const DEFAULT_MDX_RENDERER = `
import { mdx } from '@mdx-js/react'
`

module.exports = function mdxLoader (source) {
  source = mdx.sync(source)
  source = DEFAULT_MDX_RENDERER + '\n' + source
  return source
}
