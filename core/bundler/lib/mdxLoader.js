const remarkGfm = require('remark-gfm').default
const { compileSync } = require('@mdx-js/mdx')

module.exports = function getMDXLoader (source) {
  try {
    source = compileSync(source, {
      providerImportSource: '@startupjs/mdx/useMDXComponents',
      remarkPlugins: [remarkGfm],
      jsx: true
    }).value
  } catch (err) {
    if (err) {
      console.log('>> mdx compile error', err)
      throw err
    }
  }
  return source
}
