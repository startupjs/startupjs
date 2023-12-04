const { getPackages } = require('@startupjs/registry/lib/loader')
const { addDefault } = require('@babel/helper-module-imports')
const babelParser = require('@babel/parser')
const template = require('@babel/template').default
const t = require('@babel/types')

const MAGIC_LIBRARY = 'startupjs/plugins'

const buildPackagesConst = template(`
  const %%local%% = %%packages%%
`)

module.exports = function (babel) {
  let done
  let $program

  return {
    post () {
      done = undefined
      $program = undefined
    },
    visitor: {
      Program: ($this, { opts: { env } }) => {
        if (!env) throw $this.buildCodeFrameError("[@startupjs-plugin-startupjs-plugins] You must specify 'env' in babel plugin options")
        $program = $this
      },
      ImportDeclaration: ($this, { opts: { root, env } }) => {
        if (done) return
        if (!validateImport($this)) return

        const {
          node: {
            specifiers: [{
              local
            }]
          }
        } = $this

        // traverse though the packages tree and find all module, plugins and configs for them
        let packages = getPackages('server', root)

        // delete meta field which is private for the builder process
        // and should not be exposed to either server or client bundles
        packages = packages.map(i => {
          i = { ...i }
          delete i.meta
          return i
        })

        // convert to babel expression
        packages = babelParser.parseExpression(JSON.stringify(packages))

        // go through each package and replace paths with the actual imported files.
        // packages structure is the following:
        // [
        //   {
        //     type: 'plugin',
        //     name: 'startupjs-plugin-serve-static-promo',
        //     for: 'startupjs',
        //     inits: [
        //       {
        //         env: 'isomorphic',
        //         init: '/node_modules/path/to/plugin/isomorphic.js', <-- will be replaced
        //         config: '/startupjs.config/plugin.isomorphic.js' <-- will be replaced
        //       },
        //       {
        //         env: 'client',
        //         init: '/node_modules/path/to/plugin/client.js', <-- will be replaced
        //         config: '/startupjs.config/plugin.client.js' <-- will be replaced
        //       }
        //     ]
        //   },
        //   ...
        // ]
        for (const packageElement of packages.elements) {
          for (const packageProperty of packageElement.properties) {
            const { key, value } = packageProperty
            if (key.value === 'inits' && t.isArrayExpression(value)) {
              for (const initElement of value.elements) {
                for (const initProperty of initElement.properties) {
                  const { key, value } = initProperty
                  if (['init', 'config'].includes(key.value) && t.isStringLiteral(value)) {
                    const imported = addDefaultImport($program, value.value)
                    initProperty.value = imported
                  }
                }
              }
              break
            }
          }
        }

        // replace magic import with the 'packages' constant
        const packagesConst = buildPackagesConst({ local, packages })
        $this.remove()
        const $lastImport = $program
          .get('body')
          .filter($i => $i.isImportDeclaration())
          .pop()
        $lastImport.insertAfter(packagesConst)

        done = true
      }
    }
  }
}

function addDefaultImport ($program, sourceName) {
  return addDefault($program, sourceName, {
    importedInterop: 'uncompiled',
    importPosition: 'after'
  })
}

// Handle only imports which import a single 'default'
function validateImport ($import) {
  const { node } = $import

  if (!(
    node.specifiers &&
    node.specifiers.length === 1
  )) return

  const specifier = node.specifiers[0]
  if (!(
    t.isImportDefaultSpecifier(specifier)
  )) return

  if (!(
    node.source.value === MAGIC_LIBRARY
  )) return

  return true
}
