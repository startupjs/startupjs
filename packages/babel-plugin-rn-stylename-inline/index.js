const { GLOBAL_NAME, LOCAL_NAME } = require('@startupjs/babel-plugin-rn-stylename-to-style/constants.cjs')
const template = require('@babel/template').default
const parser = require('@babel/parser')
const t = require('@babel/types')
const compilers = require('./compilers')
const MAGIC_LIBRARY = 'startupjs'

const buildConst = template(`
  const %%variable%% = %%value%%
`)

module.exports = function (babel) {
  let usedCompilers
  let skip
  let $program

  return {
    post () {
      usedCompilers = undefined
      skip = undefined
      $program = undefined
    },
    visitor: {
      Program: {
        enter ($this, state) {
          usedCompilers = getUsedCompilers($this)
          if (Object.keys(usedCompilers).length === 0) {
            skip = true
          }
          $program = $this
        }
      },
      TaggedTemplateExpression: ($this, state) => {
        if (skip) return

        // I. validate template
        if (!validateTemplate($this, usedCompilers)) return

        // II. compile template
        const source = $this.node.quasi.quasis[0]?.value?.raw || ''
        const compiler = $this.node.tag.name
        const filename = state.file?.opts?.filename
        const platform = state.opts?.platform
        const compiledString = usedCompilers[compiler](source, filename, { platform })
        const compiledExpression = parser.parseExpression(compiledString)

        // III. find parent function or program
        const $function = $this.getFunctionParent()

        // IV. LOCAL. if parent is function -- handle local
        if ($function) {
          // 1. define a `const` variable at the top of the file
          //    with the unique identifier
          const localIdentifier = $program.scope.generateUidIdentifier('localCssInstance')
          insertAfterImports($program, buildConst({
            variable: localIdentifier,
            value: compiledExpression
          }))

          // 2. reassign this unique identifier to a constant LOCAL_NAME
          //    in the scope of current function
          $function.get('body').unshiftContainer('body', buildConst({
            variable: t.identifier(LOCAL_NAME),
            value: localIdentifier
          }))

        // V. GLOBAL. if parent is program -- handle global
        } else {
          // 1. define a `const` variable at the top of the file
          //    with the constant GLOBAL_NAME
          insertAfterImports($program, buildConst({
            variable: t.identifier(GLOBAL_NAME),
            value: compiledExpression
          }))
        }

        // VI. Remove template expression after processing
        $this.remove()

        // TODO: Throw error if global styles were already added or
        //       local styles were already added to the same function scope
      }
    }
  }
}

function insertAfterImports ($program, expressionStatement) {
  const lastImport = $program
    .get('body')
    .filter($i => $i.isImportDeclaration())
    .pop()

  if (lastImport) {
    lastImport.insertAfter(expressionStatement)
  } else {
    $program.unshift(expressionStatement)
  }
}

function validateTemplate ($template, usedCompilers = {}) {
  if (!$template.get('tag').isIdentifier()) return
  const { node: { tag, quasi } } = $template
  if (!usedCompilers[tag.name]) return
  if (quasi.expressions.length > 0) {
    throw $template.buildCodeFrameError(`
      Expression interpolations are not supported in css\`\` and styl\`\`.
    `)
  }
  return true
}

function getUsedCompilers ($program) {
  const res = {}
  for (const $import of $program.get('body')) {
    if (!$import.isImportDeclaration()) continue
    if ($import.node.source.value !== MAGIC_LIBRARY) continue
    for (const $specifier of $import.get('specifiers')) {
      if (!$specifier.isImportSpecifier()) continue
      const { local, imported } = $specifier.node
      if (compilers[imported.name]) {
        res[local.name] = compilers[imported.name]
        $specifier.remove()
      }
    }
    if ($import.get('specifiers').length === 0) $import.remove()
  }
  return res
}
