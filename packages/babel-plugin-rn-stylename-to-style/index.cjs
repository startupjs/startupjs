const nodePath = require('path')

const PROCESS_PATH = '@startupjs/babel-plugin-rn-stylename-to-style/process'
const STYLE_NAME_REGEX = /(?:^s|S)tyleName$/
const STYLE_REGEX = /(?:^s|S)tyle$/
const ROOT_STYLE_PROP_NAME = 'style'

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

  function generateRequire (name) {
    const require = t.callExpression(t.identifier('require'), [
      t.stringLiteral(PROCESS_PATH)
    ])
    const processFn = t.memberExpression(require, t.identifier('process'))
    const d = t.variableDeclarator(name, processFn)
    return t.variableDeclaration('var', [d])
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

  function handleStyleNames (jsxOpeningElementPath, state) {
    let styleName
    const inlineStyles = []

    // Find root styleName
    for (const key in styleHash) {
      if (key === ROOT_STYLE_PROP_NAME) {
        styleName = styleHash[key].styleName
      }
    }

    // Check if styleName exists and if it can be processed
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

    // Gather all inline styles
    for (const key in styleHash) {
      if (styleHash[key].style) {
        inlineStyles.push(t.objectProperty(
          t.identifier(key),
          styleHash[key].style.node.value.expression
        ))
      }
    }

    // Create a `process` function call
    state.hasTransformedClassName = true
    const obj = specifier.local.name
    const processCall = t.callExpression(
      state.reqName,
      [
        t.isStringLiteral(styleName.node.value)
          ? styleName.node.value
          : styleName.node.value.expression,
        t.identifier(obj),
        t.objectExpression(inlineStyles)
      ]
    )

    jsxOpeningElementPath.node.attributes.push(
      t.jsxSpreadAttribute(processCall)
    )

    // Remove old attributes
    for (const key in styleHash) {
      // TODO: Instead of removing, handle it by merging with resulting *style,
      //       if exists
      if (styleHash[key].style) styleHash[key].style.remove()
      if (styleHash[key].styleName) styleHash[key].styleName.remove()
    }

    // Clear hash since we handled everything
    for (const key in styleHash) {
      delete styleHash[key].styleName
      delete styleHash[key].style
      delete styleHash[key]
    }
    styleHash = {}
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
            lastImportOrRequire.insertAfter(
              state.opts.useImport
                ? generateImport(state.reqName)
                : generateRequire(state.reqName)
            )
          }
        }
      },
      ImportDeclaration: function importResolver (path, state) {
        const extensions =
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
          // TODO: Don't handle *StyleName separately, instead merge it into handleStyleNames()
          for (const key in styleHash) {
            // root styleName can only be handled by new logic in handleStyleNames()
            if (key === ROOT_STYLE_PROP_NAME) continue
            if (styleHash[key].styleName) {
              handleStyleName(state, key, styleHash[key].styleName, styleHash[key].style)
              delete styleHash[key].styleName
              delete styleHash[key].style
              delete styleHash[key]
            }
          }
          // New logic with support for ::part(name) pseudo-class
          handleStyleNames(path, state)
          styleHash = {}
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
