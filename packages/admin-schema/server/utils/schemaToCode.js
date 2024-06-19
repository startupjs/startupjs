import { parseSync } from '@babel/core'
import _traverseModule from '@babel/traverse'
import _templateModule from '@babel/template'
import _generateModule from '@babel/generator'
import _typesModule from '@babel/types'
import { ESLint } from 'eslint'
import { SCHEMA_EXPORT_NAME } from '../constants.js'
import { ASSOCIATION_SPREAD_KEY, ASSOCIATION_TYPES } from '../../isomorphic/constants.js'

// traverse might not be available as an ESM default import
const traverse = typeof _traverseModule === 'function' ? _traverseModule : _traverseModule.default
const template = typeof _templateModule === 'function' ? _templateModule : _templateModule.default
const generate = typeof _generateModule === 'function' ? _generateModule : _generateModule.default
const t = typeof _typesModule.importSpecifier === 'function' ? _typesModule : _typesModule.default

const astExportSchema = template.ast(`
  export const schema = {}
`)
const STARTUPJS_ORM_IMPORT = 'startupjs/orm'

export default async function schemaToCode (schema, originalCode) {
  const ast = parseSync(originalCode, {
    sourceType: 'module',
    babelrc: false,
    configFile: false
  })
  let hasSchema
  onSchemaPath(ast, () => { hasSchema = true })
  if (!hasSchema) {
    // add `export const schema = {}` if it's not found
    traverse(ast, {
      Program ($this) {
        const $lastImport = $this.get('body').filter($i => $i.isImportDeclaration()).pop()
        if ($lastImport) {
          $lastImport.insertAfter(astExportSchema)
        } else {
          $this.get('body').unshift(astExportSchema)
        }
      }
    })
  }
  const usedAssociations = new Set()
  onSchemaPath(ast, $schema => {
    $schema.replaceWith(schemaToAst(schema, { usedAssociations }))
  })
  updateImports(ast, { usedAssociations })
  const code = generate(ast, {}, originalCode).code
  const eslint = new ESLint({
    fix: true,
    useEslintrc: false,
    overrideConfig: {
      extends: ['startupjs'],
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest'
      }
    }
  })
  const results = await eslint.lintText(code)
  return results[0].output
}

function onSchemaPath (ast, cb) {
  traverse(ast, {
    ExportNamedDeclaration ($this) {
      const $declaration = $this.get('declaration')
      if (!$declaration.node) return
      if (!$declaration.isVariableDeclaration()) return
      const $declarator = $declaration.get('declarations.0')
      if (!$declarator.node) return
      if ($declarator.get('id').node.name !== SCHEMA_EXPORT_NAME) return
      const $init = $declarator.get('init')
      if (!$init.node) return
      if (!$init.isObjectExpression()) return
      cb?.($init)
    }
  })
}

function schemaToAst (schema, { usedAssociations } = {}) {
  schema = JSON.parse(JSON.stringify(schema))
  // templatize associations to later replace them with the spread element
  schema = templatizeAssociations(schema, { usedAssociations })
  let stringifiedSchema = JSON.stringify(schema)
  // replaced associations with the actual spreads
  stringifiedSchema = stringifiedSchema.replace(/"\{\{\{(.*?)\}\}\}":true/g, ' $1 ')
  return template.ast(`(${stringifiedSchema})`).expression
}

// recursively traverse the schema object and replace associations with a templatized value
//   "$$code_spread_association": {
//     "collection": "events",
//     "type": "belongsTo",
//   },
// will be replaced with:
//   "{{{...belongsTo('events')}}}": true
// and later on after the schema is stringified the `"{{{...}}}": true` will be replaced with `...`
function templatizeAssociations (value, options) {
  if (Array.isArray(value)) {
    return value.map(i => templatizeAssociations(i, options))
  } else if (typeof value === 'object') {
    const associations = []
    for (const key in value) {
      if (key === ASSOCIATION_SPREAD_KEY) {
        const { type, collection } = value[key]
        if (!ASSOCIATION_TYPES.includes(type)) throw Error(`Unsupported association type: '${type}'`)
        if (!/^\w+$/.test(collection)) throw Error(`Invalid collection name: '${collection}'`)
        options?.usedAssociations?.add(type)
        delete value[key]
        associations.push(`{{{...${type}('${collection}')}}}`)
      } else {
        value[key] = templatizeAssociations(value[key], options)
      }
    }
    // bubble up associations to the top level
    return Object.assign({}, Object.fromEntries(associations.map(key => [key, true])), value)
  } else {
    return value
  }
}

function updateImports (ast, { usedAssociations }) {
  let hasOrmImport
  traverse(ast, {
    ImportDeclaration ($this) {
      const $source = $this.get('source')
      if ($source.node.value !== STARTUPJS_ORM_IMPORT) return
      hasOrmImport = true
      const importedAssociations = new Set()
      for (const $specifier of $this.get('specifiers')) {
        if (!$specifier.isImportSpecifier()) continue
        const imported = $specifier.get('imported').node.name
        if (!ASSOCIATION_TYPES.includes(imported)) continue
        importedAssociations.add(imported)
      }
      for (const association of usedAssociations) {
        if (importedAssociations.has(association)) continue
        const $lastSpecifier = $this.get('specifiers').pop()
        $lastSpecifier.insertAfter(
          t.importSpecifier(t.identifier(association), t.identifier(association))
        )
      }
      for (const $specifier of $this.get('specifiers')) {
        if (!$specifier.isImportSpecifier()) continue
        const imported = $specifier.get('imported').node.name
        if (!ASSOCIATION_TYPES.includes(imported)) continue
        if (!usedAssociations.has(imported)) {
          $specifier.remove()
        }
      }
      if (!$this.node.specifiers?.length) $this.remove()
    }
  })
  if (!hasOrmImport && usedAssociations.size > 0) {
    const importAst = template.ast(`import { ${[...usedAssociations].join(' ,')} } from '${STARTUPJS_ORM_IMPORT}'`)
    traverse(ast, {
      Program ($this) {
        $this.node.body.unshift(importAst)
      }
    })
  }
}
