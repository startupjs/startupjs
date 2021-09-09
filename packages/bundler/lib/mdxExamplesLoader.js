const { parse } = require('@babel/parser')
const traverse = require('@babel/traverse').default
const REGEX_EXAMPLE = /(```jsx +example[\s\S]*?\n)([\s\S]*?)(```)/g

const EXAMPLE_FLAGS = [
  'no-scroll',
  'pure'
]

module.exports = function mdxExamplesLoader (source) {
  const observer = "import { observer as __observer } from 'startupjs'"

  if (source.match(REGEX_EXAMPLE)) {
    let globals = {}
    const imports = getImports(source)

    if (imports) {
      const ast = parse(imports, { sourceType: 'module', plugins: ['jsx'] })
      traverse(ast, {
        ImportDeclaration (pathNode) {
          pathNode.node.specifiers.forEach(node => {
            if (node.local.name === 'styl') return
            globals[node.local.name] = node.local.name
          })
        }
      })
    }

    return observer + '\n\n' + replacer(source, globals)
  }

  return observer + '\n\n' + source
}

function replacer (source, globals) {
  return source.replace(REGEX_EXAMPLE, function (match, p1, p2) {
    const parts = p1.trim().split(' ')
    const sectionParts = []

    for (const part of parts) {
      if (EXAMPLE_FLAGS.includes(part)) {
        sectionParts.push(camelize(part))
        continue
      }
    }

    let jsxCode = p2.trim().replace(/\n+/g, '\n')
    if (/^</.test(jsxCode)) jsxCode = 'return (<React.Fragment>' + jsxCode + '</React.Fragment>)'

    let stringCode = p2.replace(/\n/g, '&#9094')
    stringCode = escapeRegExp(stringCode)

    globals = JSON.stringify(globals).replace(/"/gi, '')

    return (
      `<section ${sectionParts.join(' ')} initCode={\`${stringCode}\`} globals={${globals}}>
        <React.Fragment>
          {React.createElement(__observer(function Example () {
            ${jsxCode}
          }))}
        </React.Fragment>
      </section>`
    )
  })
}

function getImports (source) {
  const lines = source.replace(/\n+/g, '\n').split('\n')
  let startImport = false
  let lastImportIndex = 0

  for (let index = 0; lines.length; index++) {
    const line = lines[index]
    lastImportIndex = index

    if (line.includes('import')) {
      if (line.includes('{') && !line.includes('}')) {
        startImport = true
      }
      continue
    }
    if (startImport && line.includes('}')) {
      startImport = false
      continue
    }
    if (!line.includes('import') && !startImport) {
      break
    }
  }

  return lines.slice(0, lastImportIndex).join('\n')
}

function escapeRegExp (string) {
  return string.replace(/[.*+?^$`{}()|[\]\\]/g, '\\$&')
}

function camelize (string) {
  return string.replace(/-./g, x => x.toUpperCase()[1])
}
