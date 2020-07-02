const nodePath = require('path')

const PROCESS_PATH = '@startupjs/babel-plugin-rn-stylename-to-style/process'
const STYLE_NAME_REGEX = /(?:^s|S)tyleName$/
const STYLE_REGEX = /(?:^s|S)tyle$/

function getExt (node) {
  return nodePath.extname(node.source.value).replace(/^\./, '')
}

function convertStyleName (name) {
  return name.replace(/Name$/, '')
}

module.exports = function (babel) {
  const t = babel.types

  let styleHash = {}
  let specifier

  function isRequire (node) {
    return (
      node &&
      node.declarations &&
      node.declarations[0] &&
      node.declarations[0].init &&
      node.declarations[0].init.callee &&
      node.declarations[0].init.callee.name === 'require'
    )
  }

  function generateImport (name) {
    return t.importDeclaration(
      [t.importSpecifier(name, t.identifier('process'))],
      t.stringLiteral(PROCESS_PATH)
    )
  }

  function getStyleFromExpression (expression, state) {
    state.hasTransformedClassName = true
    const obj = specifier.local.name
    const processCall = t.callExpression(
      state.reqName,
      [expression, t.identifier(obj)]
    )
    return processCall
  }

  function handleStyleName (state, convertedName, styleName, style) {
    let expressions

    if (
      styleName == null ||
      specifier == null ||
      !(
        t.isStringLiteral(styleName.node.value) ||
        t.isJSXExpressionContainer(styleName.node.value)
      )
    ) {
      return
    }

    if (t.isStringLiteral(styleName.node.value)) {
      expressions = [
        getStyleFromExpression(styleName.node.value, state)
      ]
    } else if (t.isJSXExpressionContainer(styleName.node.value)) {
      expressions = [
        getStyleFromExpression(styleName.node.value.expression, state)
      ]
    }

    const hasStyleNameAndStyle =
      styleName &&
      style &&
      styleName.parentPath.node === style.parentPath.node

    if (hasStyleNameAndStyle) {
      style.node.value = t.jsxExpressionContainer(
        t.arrayExpression(
          expressions.concat([style.node.value.expression])
        )
      )
      styleName.remove()
    } else {
      if (expressions.length > 1) {
        styleName.node.value = t.jsxExpressionContainer(t.arrayExpression(expressions))
      } else {
        styleName.node.value = t.jsxExpressionContainer(expressions[0])
      }
      styleName.node.name.name = convertedName
    }
  }

  return {
    post () {
      styleHash = {}
      specifier = undefined
    },
    visitor: {
      Program: {
        enter (path, state) {
          state.reqName = path.scope.generateUidIdentifier(
            'processStyleName'
          )
        },
        exit (path, state) {
          if (!state.hasTransformedClassName) {
            return
          }

          const lastImportOrRequire = path
            .get('body')
            .filter(p => p.isImportDeclaration() || isRequire(p.node))
            .pop()

          if (lastImportOrRequire) {
            lastImportOrRequire.insertAfter(generateImport(state.reqName))
          }
        }
      },
      ImportDeclaration: function importResolver (path, state) {
        const extensions =
          state.opts != null &&
          Array.isArray(state.opts.extensions) &&
          state.opts.extensions

        if (!extensions) {
          throw new Error(
            'You have not specified any extensions in the plugin options.'
          )
        }

        const node = path.node

        if (extensions.indexOf(getExt(node)) === -1) {
          return
        }

        const anonymousImports = path.container.filter(n => {
          return (
            t.isImportDeclaration(n) &&
            n.specifiers.length === 0 &&
            extensions.indexOf(getExt(n)) > -1
          )
        })

        if (anonymousImports.length > 1) {
          throw new Error(
            'Cannot use anonymous style name with more than one stylesheet import.'
          )
        }

        specifier = node.specifiers[0]

        if (!specifier) {
          specifier = t.ImportDefaultSpecifier(
            path.scope.generateUidIdentifier()
          )
          node.specifiers = [specifier]
        }
      },
      JSXOpeningElement: {
        exit (path, state) {
          for (const key in styleHash) {
            handleStyleName(state, key, styleHash[key].styleName, styleHash[key].style)
            delete styleHash[key].styleName
            delete styleHash[key].style
            delete styleHash[key]
          }
        }
      },
      JSXAttribute: function JSXAttribute (path, state) {
        const name = path.node.name.name
        if (STYLE_NAME_REGEX.test(name)) {
          const convertedName = convertStyleName(name)
          if (!styleHash[convertedName]) styleHash[convertedName] = {}
          styleHash[convertedName].styleName = path
        } else if (STYLE_REGEX.test(name)) {
          if (!styleHash[name]) styleHash[name] = {}
          styleHash[name].style = path
        }
      }
    }
  }
}
