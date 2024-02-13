const { addNamed } = require('@babel/helper-module-imports')
const template = require('@babel/template').default

const ASYNC_IMPORTS_ANNOTATION_REGEX = /@asyncImports/

const buildLazyImport = template(`
  const %%local%% = %%lazy%%(() => import(%%source%%))
`)

const buildLazyExport = template(`
  export const %%exported%% = %%lazy%%(() => import(%%source%%))
`)

module.exports = function (babel) {
  return {
    visitor: {
      Program: {
        enter ($program, state) {
          if (!hasAnnotation(state)) {
            $program.stop()
            return
          }
          state.lazy = addLazyImport($program)
        },
        exit (_, state) {
          delete state.lazy
        }
      },
      ImportDeclaration ($import, state) {
        if (!validateImport($import)) return

        const {
          node: {
            source,
            specifiers: [{ local }]
          }
        } = $import
        const lazyImport = buildLazyImport({ local, source, lazy: state.lazy })

        $import.replaceWith(lazyImport)
      },
      ExportDeclaration ($export, state) {
        if (!validateExport($export)) return

        const {
          node: {
            source,
            specifiers: [{ exported }]
          }
        } = $export
        const lazyExport = buildLazyExport({ exported, source, lazy: state.lazy })

        $export.replaceWith(lazyExport)
      }
    }
  }
}

function addLazyImport ($program) {
  return addNamed($program, 'lazy', 'react', {
    importedInterop: 'uncompiled',
    ensureLiveReference: true
  })
}

function validateImport ($import) {
  if ($import.get('specifiers').length !== 1) return

  const $specifier = $import.get('specifiers.0')
  if (!$specifier.isImportDefaultSpecifier()) return

  return true
}

function validateExport ($export) {
  if ($export.get('specifiers').length !== 1) return

  const $specifier = $export.get('specifiers.0')
  const $local = $specifier.get('local')
  const $exported = $specifier.get('exported')
  if (
    !($local.isIdentifier() && $local.node.name === 'default' && $exported.isIdentifier())
  ) { return }

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
