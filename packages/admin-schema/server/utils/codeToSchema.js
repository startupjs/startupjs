import { parseSync } from '@babel/core'
import _traverseModule from '@babel/traverse'
import { SCHEMA_EXPORT_NAME } from '../constants.js'
import { ASSOCIATION_SPREAD_KEY, ASSOCIATION_TYPES } from '../../isomorphic/constants.js'

// traverse might not be available as an ESM default import
const traverse = typeof _traverseModule === 'function' ? _traverseModule : _traverseModule.default

export default function codeToSchema (code) {
  const ast = parseSync(code, {
    sourceType: 'module',
    babelrc: false,
    configFile: false
  })
  let schema
  traverse(ast, {
    // find a named export (export const schema = { ... })
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
      schema = parseValue($init)
    }
  })
  return schema
}

// recursively parse object expression into JSON object
function parseValue ($value) {
  if ($value.isObjectExpression()) {
    const object = {}
    for (const $property of $value.get('properties')) {
      if ($property.isSpreadElement()) {
        const [key, value] = parseAssociation($property)
        object[key] = value
        continue
      }
      if (!$property.isObjectProperty()) throw Error('Unsupported property type:\n' + $property.toString())
      const $key = $property.get('key')
      let key
      if ($key.isIdentifier()) {
        key = $key.node.name
      } else if ($key.isLiteral()) {
        key = $key.node.value
      } else {
        throw Error('Unsupported key type:\n' + $key.toString())
      }
      const value = parseValue($property.get('value'))
      object[key] = value
    }
    return object
  } else if ($value.isLiteral()) {
    return $value.node.value
  } else if ($value.isArrayExpression()) {
    return $value.get('elements').map($element => parseValue($element))
  } else {
    throw Error('Unsupported value type:\n' + $value.toString())
  }
}

// spread element is used to extend field with the association properties
// e.g. { ...belongsTo('events'), required: true }
//
// Transforms:
//   ...belongsTo('events')
// to:
//   '$$code_spread_association', { type: 'belongsTo', collection: 'events' }
function parseAssociation ($spreadElement) {
  const $argument = $spreadElement.get('argument')
  if (!$argument.isCallExpression()) {
    throw Error('Association must be done through spreading the function. Got:\n' + $argument.toString())
  }
  const $callee = $argument.get('callee')
  if (!$callee.isIdentifier()) {
    throw Error('Association function must be an imported identifier. Got:\n' + $callee.toString())
  }
  const type = $callee.node.name
  if (!ASSOCIATION_TYPES.includes(type)) {
    throw Error(`Unsupported association type.\nSupported ${ASSOCIATION_TYPES}.\nGot:\n` + type)
  }
  const $arguments = $argument.get('arguments')
  if ($arguments.length !== 1) {
    throw Error('Association function accepts collection name as a single argument. Got:\n' + $arguments.toString())
  }
  const $collection = $arguments[0]
  if (!$collection.isStringLiteral()) {
    throw Error('Association collection must be a string. Got:\n' + $arguments[0].toString())
  }
  const collection = $collection.node.value
  return [ASSOCIATION_SPREAD_KEY, { type, collection }]
}
