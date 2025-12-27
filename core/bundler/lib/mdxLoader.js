const remarkGfm = require('remark-gfm').default
const { compileSync } = require('@mdx-js/mdx')
const { readFileSync } = require('fs')
const path = require('path')

const OLD_MDX_IMPORT = '@startupjs/mdx/useMDXComponents'
const MDX_IMPORT = '@startupjs-ui/mdx'

module.exports = function getMDXLoader (source) {
  try {
    source = compileSync(source, {
      providerImportSource: getMDXComponentsImport(),
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

let mdxComponentsImport
// check if the project's package.json has an old @startupjs/ui dependency
// and use old mdx library in this case for backward compatibility
function getMDXComponentsImport () {
  if (mdxComponentsImport) return mdxComponentsImport
  let hasOldStartupUi = false
  try {
    const projectPkgPath = path.join(process.cwd(), 'package.json')
    const packageJson = readFileSync(projectPkgPath, 'utf8')
    if (/"@startupjs\/ui"/.test(packageJson)) hasOldStartupUi = true
  } catch (err) {}
  if (hasOldStartupUi) {
    mdxComponentsImport = OLD_MDX_IMPORT
  } else {
    mdxComponentsImport = MDX_IMPORT
  }
  return mdxComponentsImport
}
