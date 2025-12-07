const { join, resolve } = require('path')
const { existsSync } = require('fs')
const tsj = require('ts-json-schema-generator')
const DEFAULT_MAGIC_EXPORT_NAME = '_PropsJsonSchema'
const DEFAULT_INTERFACE_MATCH = 'export interface'

module.exports = function babelPluginEliminator (
  { template, types: t },
  {
    magicExportName = DEFAULT_MAGIC_EXPORT_NAME,
    interfaceMatch = DEFAULT_INTERFACE_MATCH
  }
) {
  return {
    visitor: {
      Program: {
        enter ($this, { file }) {
          const filename = file.opts.filename
          const code = file.code
          if (!code.includes('export const ' + magicExportName)) return
          const schema = getInterfaceJsonSchema($this, { code, filename, magicExportName, interfaceMatch })

          // match 'export const {magicExportName} = ' and replace its value with schema
          $this.traverse({
            ExportNamedDeclaration ($this) {
              const $declaration = $this.get('declaration')
              if (!$declaration.isVariableDeclaration()) return
              const $declarator = $declaration.get('declarations.0')
              const id = $declarator.node.id
              if (!t.isIdentifier(id) || id.name !== magicExportName) return
              $declarator.get('init').replaceWith(t.valueToNode(schema))
            }
          })
        }
      }
    }
  }
}

function getInterfaceJsonSchema ($program, { code, filename, magicExportName, interfaceMatch }) {
  try {
    filename = resolve(process.cwd(), filename)
    // get exported interface name
    const interfaceLine = code.split('\n').find(line => line.includes(interfaceMatch))
    if (!interfaceLine) throw $program.buildCodeFrameError(ERRORS.noMatchInterface(interfaceMatch))
    const interfaceName = getInterfaceName(interfaceLine)
    if (!interfaceName) throw $program.buildCodeFrameError(ERRORS.noInterfaceName(interfaceLine))
    // generate schema using ts-json-schema-generator
    const config = {
      path: filename,
      type: interfaceName,
      skipTypeCheck: true,
      fullDescription: true,
      jsDoc: 'extended'
    }
    const tsconfigPath = join(process.cwd(), 'tsconfig.json')
    if (existsSync(tsconfigPath)) config.tsconfig = tsconfigPath
    const schema = tsj.createGenerator(config).createSchema(config.type)
    schema.interfaceName = interfaceName
    // mark the properties from the base Interface as { extendedFrom: extendsName } to hide them if needed
    const { name: extendsName, omittedKeys = [] } = getExtendsInterfaceMeta(interfaceLine)
    if (extendsName) {
      schema.extendedFrom = extendsName
      if (omittedKeys.length) schema.extendedOmittedKeys = omittedKeys
      config.type = extendsName
      const extendsSchema = tsj.createGenerator(config).createSchema(config.type)
      for (const key in schema.properties) {
        if (key in extendsSchema.properties && !omittedKeys.includes(key)) {
          schema.properties[key].extendedFrom = extendsName
        }
      }
    }
    return schema
  } catch (err) {
    console.error(
      '> @startupjs/babel-plugin-ts-to-json-schema error (@startupjs/docs/Sandbox component won\'t work):',
      filename,
      err
    )
    return {}
  }
}

function getInterfaceName (interfaceLine) {
  if (typeof interfaceLine !== 'string') return
  const interfaceLineWords = interfaceLine.split(' ')
  const interfaceIndex = interfaceLineWords.findIndex(word => word === 'interface')
  if (interfaceIndex === -1) return
  const interfaceNameIndex = interfaceIndex + 1
  return interfaceLineWords[interfaceNameIndex]
}

function getExtendsInterfaceMeta (interfaceLine) {
  if (typeof interfaceLine !== 'string') return {}
  const interfaceLineWords = interfaceLine.split(' ')
  const extendsIndex = interfaceLineWords.findIndex(word => word === 'extends')
  if (extendsIndex === -1) return {}
  const extendsNameIndex = extendsIndex + 1
  // take all words after 'extends' until '{' or end of line
  let name = interfaceLineWords.slice(extendsNameIndex).join(' ').split('{')[0].trim()
  // disassemble Omit<SomeInterface, 'a' | 'b'> constructions and also get the list of omitted keys
  let omittedKeys = []
  if (name.startsWith('Omit<')) {
    omittedKeys = name.slice(name.indexOf(',') + 1, name.lastIndexOf('>')).trim()
    omittedKeys = omittedKeys.split('|').map(key => key.trim().slice(1, -1))
    name = name.slice(5, name.indexOf(',')).trim()
  }
  return { name, omittedKeys }
}

const ERRORS = {
  noMatchInterface: (interfaceMatch) => `
    > babel-plugin-ts-to-json-schema: Cannot find interface which matches "${interfaceMatch}"
  `,
  noInterfaceName: (interfaceLine) => `
    > babel-plugin-ts-to-json-schema: Cannot determine interface name in matched line: "${interfaceLine}"
  `
}
