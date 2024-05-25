const { readFileSync } = require('fs')
const dotenv = require('dotenv')
const template = require('@babel/template').default

const cache = {}
const overrideCache = {}

// import PHome from './PHome'
const buildEnvConst = template(`
  const %%key%% = %%value%%
`)

// Handle BASE_URL in a special way.
// If window.location.origin is present it should always be it.
function getOverrideTemplate (override) {
  if (overrideCache[override]) return overrideCache[override]
  overrideCache[override] = template(`
    const %%key%% = (${override}) || %%value%%
  `)
  return overrideCache[override]
}

function parseDotenvFile (path) {
  if (cache[path]) return cache[path]
  let content

  try {
    content = readFileSync(path)
  } catch (_) {
    // The env file does not exist.
    return {}
  }

  cache[path] = dotenv.parse(content)
  return cache[path]
}

module.exports = ({ types: t }) => {
  return {
    pre () {
      this.opts = {
        moduleName: '@env',
        path: '.env',
        allowUndefined: true,
        override: {},
        ...this.opts
      }

      if (!Array.isArray(this.opts.path)) {
        this.opts.path = [this.opts.path]
      }

      this.env = this.opts.path.reduce((env, path) => ({
        ...env,
        ...parseDotenvFile(path)
      }), {})

      this.vars = {}
      this.nameMapping = {}
    },

    visitor: {
      Program: {
        exit (path) {
          if (Object.keys(this.vars).length === 0) return

          const lastImport = path
            .get('body')
            .filter(p => p.isImportDeclaration())
            .pop()

          for (const key in this.vars) {
            const envName = this.vars[key]
            const value = this.env[envName]
            let buildTemplate
            if (this.opts.override[envName]) {
              buildTemplate = getOverrideTemplate(this.opts.override[envName])
            } else {
              buildTemplate = buildEnvConst
            }
            const envConst = buildTemplate({
              key: t.identifier(key),
              value: t.valueToNode(value)
            })
            if (lastImport) {
              lastImport.insertAfter(envConst)
            } else {
              path.unshiftContainer('body', envConst)
            }
          }
        }
      },
      ImportDeclaration (path) {
        if (path.node.source.value === this.opts.moduleName) {
          this.hasEnv = true

          path.node.specifiers.forEach((specifier, idx) => {
            if (specifier.type === 'ImportDefaultSpecifier') {
              throw path.get('specifiers')[idx].buildCodeFrameError('Default import is not supported')
            }

            if (specifier.type === 'ImportNamespaceSpecifier') {
              throw path.get('specifiers')[idx].buildCodeFrameError('Wildcard import is not supported')
            }

            const importedId = specifier.imported.name
            const localId = specifier.local.name

            if (
              !this.opts.allowUndefined &&
              !Object.prototype.hasOwnProperty.call(this.env, importedId) &&
              !this.opts.override[importedId]
            ) {
              throw path.get('specifiers')[idx].buildCodeFrameError(
                `"${importedId}" is not defined in ${JSON.stringify(this.opts.path)}`
              )
            }

            this.vars[localId] = importedId
          })

          path.remove()
        }
      }
    }
  }
}
