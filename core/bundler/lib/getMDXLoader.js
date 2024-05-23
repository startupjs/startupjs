const DEFAULT_MDX_RENDERER = `
import { mdx } from '@mdx-js/react'
`
const remarkGfm = require('remark-gfm')

module.exports = async function getMDXLoader () {
  const mdx = await import('@mdx-js/mdx')

  return (source) => {
    source = mdx.compileSync(source, {
      providerImportSource: '@startupjs/mdx/client/MDXProvider/index.js',
      remarkPlugins: [remarkGfm]
    })
    source = DEFAULT_MDX_RENDERER + '\n' + source
    // To make mdx works, we should remove somehow the \n character child
    // from the children of MDXContent in the output source.
    // MDX v2 has made some changes in how it handles newlines and whitespace
    // compared to MDX v1. In MDX v1 newline are not inclided in the output,
    // but in MDX v2 it included.
    // console.log(source)
    return source
  }
}
