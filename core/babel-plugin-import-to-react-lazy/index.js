const { addNamed } = require('@babel/helper-module-imports')
const template = require('@babel/template').default
const t = require('@babel/types')

const ASYNC_IMPORTS_ANNOTATION_REGEX = /@asyncImports/

// import PHome from './PHome'
const buildLazyImport = template(`
  const %%local%% = %%lazy%%(() => import(%%source%%))
`)

// export { default as PHome } from './PHome'
const buildLazyExport = template(`
  export const %%exported%% = %%lazy%%(() => import(%%source%%))
`)

module.exports = function (babel) {
  let lazy
  let skip

  return {
    post () {
      lazy = undefined
      skip = undefined
    },
    visitor: {
      Program: {
        enter (path, state) {
          skip = !hasAnnotation(state)
          if (skip) return
          lazy = addLazyImport(path)
        }
      },
      ImportDeclaration: (path) => {
        if (skip) return
        if (!validateImport(path)) return

        const {
          node: {
            source,
            specifiers: [{
              local
            }]
          }
        } = path
        const lazyImport = buildLazyImport({ local, source, lazy })

        path.replaceWith(lazyImport)
      },
      ExportDeclaration: (path) => {
        if (skip) return
        if (!validateExport(path)) return

        const {
          node: {
            source,
            specifiers: [{
              exported
            }]
          }
        } = path
        const lazyExport = buildLazyExport({ exported, source, lazy })

        path.replaceWith(lazyExport)
      }
    }
  }
}

function addLazyImport (path) {
  return addNamed(path, 'lazy', 'react', {
    importedInterop: 'uncompiled',
    ensureLiveReference: true
  })
}

// Handle only imports which import a single 'default'
function validateImport (path) {
  const { node } = path

  if (!(
    node.specifiers &&
    node.specifiers.length === 1
  )) return

  const specifier = node.specifiers[0]
  if (!t.isImportDefaultSpecifier(specifier)) return

  return true
}

// Handle only exports which reexport a single 'default'
function validateExport (path) {
  const { node } = path

  if (!(
    node.specifiers &&
    node.specifiers.length === 1
  )) return

  const specifier = node.specifiers[0]
  const { local, exported } = specifier
  if (!(
    t.isIdentifier(local) &&
    local.name === 'default' &&
    t.isIdentifier(exported)
  )) return

  return true
}

function hasAnnotation (state) {
  const { file } = state
  if (file.ast.comments) {
    for (const comment of file.ast.comments) {
      if (ASYNC_IMPORTS_ANNOTATION_REGEX.test(comment.value)) return true
    }
  }
}
