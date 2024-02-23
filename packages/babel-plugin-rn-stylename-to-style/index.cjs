const nodePath = require('path')
const t = require('@babel/types')
const template = require('@babel/template').default

const COMPILERS = ['css', 'styl'] // used in rn-stylename-inline. TODO: move to a shared place
const PROCESS_PATH = '@startupjs/babel-plugin-rn-stylename-to-style/process'
const STYLE_NAME_REGEX = /(?:^s|S)tyleName$/
const STYLE_REGEX = /(?:^s|S)tyle$/
const ROOT_STYLE_PROP_NAME = 'style'

const GLOBAL_OBSERVER_LIBRARY = 'startupjs'
const GLOBAL_OBSERVER_DEFAULT_NAME = 'observer'

const { GLOBAL_NAME, LOCAL_NAME } = require('./constants.cjs')

const buildSafeVar = template.expression(`
  typeof %%variable%% !== 'undefined' && %%variable%%
`)

const buildImport = template(`
  import { process as %%name%% } from '${PROCESS_PATH}'
`)

const buildRequire = template(`
  const %%name%% = require('${PROCESS_PATH}').process
`)

const buildJsonParse = template(`
  const %%name%% = JSON.parse(%%jsonStyle%%)
`)

module.exports = function (babel) {
  let styleHash = {}
  let cssIdentifier
  let hasObserver
  let $program
  let usedCompilers

  function getStyleFromExpression (expression, state) {
    state.hasTransformedClassName = true
    const cssStyles = cssIdentifier.name
    const processCall = t.callExpression(
      state.reqName,
      [expression, t.identifier(cssStyles)]
    )
    return processCall
  }

  function addPartStyleToProps ($jsxAttribute) {
    const parts = getParts($jsxAttribute.get('value'))
    const $fnComponent = findReactFnComponent($jsxAttribute)
    if (!$fnComponent) {
      throw $jsxAttribute.buildCodeFrameError(`
        Closest react functional component not found for 'part' attribute.
        Or your component is named lowercase.'
      `)
    }
    let props = $fnComponent.node.params[0]
    if (!props) {
      props = $jsxAttribute.scope.generateUidIdentifier('props')
      $fnComponent.node.params[0] = props
    }
    if (t.isAssignmentPattern(props)) {
      props = props.left
    }
    const styleProps = []
    if (t.isIdentifier(props)) {
      for (const part of parts) {
        const partStyleAttr = convertPartName(part.name)
        const value = t.memberExpression(props, t.identifier(partStyleAttr))
        styleProps.push(buildDynamicPart(value, part))
      }
    } else if (t.isObjectPattern(props)) {
      // TODO: optimize to be more efficient than O(n^2)
      for (const part of parts) {
        const partStyleAttr = convertPartName(part.name)
        let exists
        // Check whether the part style property already exists
        for (const property of props.properties) {
          if (!t.isObjectProperty(property)) continue
          if (property.key.name === partStyleAttr) {
            styleProps.push(buildDynamicPart(property.value, part))
            exists = true
            break
          }
        }
        if (exists) continue
        // If part style property doesn't exist, inject it
        const key = t.identifier(partStyleAttr)
        const value = $jsxAttribute.scope.generateUidIdentifier(partStyleAttr)
        props.properties.unshift(t.objectProperty(key, value))
        styleProps.push(buildDynamicPart(value, part))
      }
    } else {
      throw $jsxAttribute.buildCodeFrameError(`
        Can't find props attribute and embed 'part' style props into it.
        Supported props formats:
          - function Hello ({ one, two }) {}
          - function Hello (props) {}
      `)
    }
    return styleProps
  }

  function handleStyleNames (jsxOpeningElementPath, state) {
    if (!Object.keys(styleHash).length) return
    const styleName = styleHash[ROOT_STYLE_PROP_NAME]?.styleName
    const partStyle = styleHash[ROOT_STYLE_PROP_NAME]?.partStyle
    const inlineStyles = []

    // Always process if 'observer' import is found in the file
    // which is needed for styles caching.
    // Otherwise, if no 'observer' found and no 'styleName' or 'part' found then skip
    if (!(hasObserver || styleName || partStyle)) return

    // Check if styleName exists and if it can be processed
    if (styleName != null) {
      if (!(
        t.isStringLiteral(styleName.node.value) ||
        t.isJSXExpressionContainer(styleName.node.value)
      )) {
        throw jsxOpeningElementPath.buildCodeFrameError(`
          styleName attribute has an unsupported type. It must be either a string or an expression.

          Most likely you wrote styleName=[] instead of styleName={[]}
        `)
      }
    }

    // Gather all inline styles
    for (const key in styleHash) {
      if (styleHash[key].style || styleHash[key].partStyle) {
        let style = []
        if (styleHash[key].style) {
          style.push(styleHash[key].style.node.value.expression)
        }
        // Part style has higher priority, so must be last
        if (styleHash[key].partStyle) {
          style = style.concat(styleHash[key].partStyle)
        }
        if (style.length > 1) {
          style = t.arrayExpression(style)
        } else {
          style = style[0]
        }
        inlineStyles.push(t.objectProperty(
          t.identifier(key),
          style
        ))
      }
    }

    // Create a `process` function call
    state.hasTransformedClassName = true
    const processCall = t.callExpression(
      state.reqName,
      [
        styleName
          ? (
              t.isStringLiteral(styleName.node.value)
                ? styleName.node.value
                : styleName.node.value.expression
            )
          : t.stringLiteral(''),
        cssIdentifier
          ? t.identifier(cssIdentifier.name)
          : t.objectExpression([]),
        buildSafeVar({ variable: t.identifier(GLOBAL_NAME) }),
        buildSafeVar({ variable: t.identifier(LOCAL_NAME) }),
        t.objectExpression(inlineStyles)
      ]
    )

    jsxOpeningElementPath.node.attributes.push(
      t.jsxSpreadAttribute(processCall)
    )

    // Remove old attributes
    for (const key in styleHash) {
      if (styleHash[key].style) styleHash[key].style.remove()
      if (styleHash[key].styleName) styleHash[key].styleName.remove()
    }

    // Clear hash since we handled everything
    for (const key in styleHash) {
      delete styleHash[key].styleName
      delete styleHash[key].style
      delete styleHash[key].partStyle
      delete styleHash[key]
    }
    styleHash = {}
  }

  function handleStyleName (state, convertedName, styleName, style) {
    let expressions

    if (
      styleName == null ||
      cssIdentifier == null ||
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
      cssIdentifier = undefined
      hasObserver = undefined
      $program = undefined
      usedCompilers = undefined
    },
    visitor: {
      Program: {
        enter ($this, state) {
          usedCompilers = getUsedCompilers($this)
          state.reqName = $this.scope.generateUidIdentifier(
            'processStyleName'
          )
          $program = $this
        },
        exit ($this, state) {
          if (!state.hasTransformedClassName) {
            return
          }

          const lastImportOrRequire = $this
            .get('body')
            .filter(p => p.isImportDeclaration() || isRequire(p.node))
            .pop()

          if (lastImportOrRequire) {
            const useImport = state.opts.useImport == null ? true : state.opts.useImport
            lastImportOrRequire.insertAfter(
              useImport
                ? buildImport({ name: state.reqName })
                : buildRequire({ name: state.reqName })
            )
          }
        }
      },
      ImportDeclaration ($this, state) {
        if (!hasObserver) hasObserver = checkObserverImport($this)

        const extensions =
          Array.isArray(state.opts.extensions) &&
          state.opts.extensions

        if (!extensions) {
          throw new Error(
            'You have not specified any extensions in the plugin options.'
          )
        }

        const node = $this.node

        if (extensions.indexOf(getExt(node)) === -1) {
          return
        }

        const anonymousImports = $this.container.filter(n => {
          return (
            t.isImportDeclaration(n) &&
            n.specifiers.length === 0 &&
            extensions.indexOf(getExt(n)) > -1
          )
        })

        if (anonymousImports.length > 1) {
          throw $this.buildCodeFrameError(
            'Cannot use anonymous style name with more than one stylesheet import.'
          )
        }

        let specifier = node.specifiers[0]

        if (!specifier) {
          specifier = t.ImportDefaultSpecifier(
            $this.scope.generateUidIdentifier('css')
          )
          node.specifiers = [specifier]
        }

        cssIdentifier = specifier.local

        // Do JSON.parse() on the css file if we receive it as a json string:
        // import css from './index.styl'
        //   v v v
        // import jsonCss from './index.styl'
        // const css = JSON.parse(jsonCss)
        if (state.opts.parseJson) {
          const lastImportOrRequire = $program
            .get('body')
            .filter(p => p.isImportDeclaration() || isRequire(p.node))
            .pop()
          const tempCssIdentifier = $this.scope.generateUidIdentifier('jsonCss')
          node.specifiers[0].local = tempCssIdentifier
          lastImportOrRequire.insertAfter(
            buildJsonParse({
              name: cssIdentifier,
              jsonStyle: tempCssIdentifier
            })
          )
        }
      },
      JSXOpeningElement: {
        exit ($this, state) {
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
          handleStyleNames($this, state)
          styleHash = {}
        }
      },
      JSXAttribute ($this, state) {
        const name = $this.node.name.name
        if (STYLE_NAME_REGEX.test(name)) {
          const convertedName = convertStyleName(name)
          if (!styleHash[convertedName]) styleHash[convertedName] = {}
          styleHash[convertedName].styleName = $this
        // Some react-native built-in stuff might have props like 'barStyle' which
        // is a string. We skip those.
        } else if (STYLE_REGEX.test(name) && !$this.get('value').isStringLiteral()) {
          if (!styleHash[name]) styleHash[name] = {}
          styleHash[name].style = $this
        } else if (name === 'part') {
          validatePart($this)
          const styleProps = addPartStyleToProps($this)
          if (!styleHash[ROOT_STYLE_PROP_NAME]) styleHash[ROOT_STYLE_PROP_NAME] = {}
          styleHash[ROOT_STYLE_PROP_NAME].partStyle = styleProps
          $this.remove()
        }
      },
      CallExpression ($this, state) {
        const $callee = $this.get('callee')
        if (!$callee.isIdentifier()) return
        if (!usedCompilers?.[$callee.node.name]) return
        // Create a `process` function call
        state.hasTransformedClassName = true
        const processCall = t.callExpression(
          state.reqName,
          [
            $this.get('arguments.0')
              ? $this.get('arguments.0').node
              : t.stringLiteral(''),
            cssIdentifier
              ? t.identifier(cssIdentifier.name)
              : t.objectExpression([]),
            buildSafeVar({ variable: t.identifier(GLOBAL_NAME) }),
            buildSafeVar({ variable: t.identifier(LOCAL_NAME) }),
            $this.get('arguments.1')
              ? $this.get('arguments.1').node
              : t.objectExpression([])
          ]
        )
        $this.replaceWith(processCall)
      }
    }
  }
}

function isRequire (node) {
  return node?.declarations?.[0]?.init?.callee?.name === 'require'
}

function getExt (node) {
  return nodePath.extname(node.source.value).replace(/^\./, '')
}

function convertStyleName (name) {
  return name.replace(/Name$/, '')
}

function convertPartName (partName) {
  if (partName === 'root') return 'style'
  return partName + 'Style'
}

function validatePart ($jsxAttribute) {
  const $value = $jsxAttribute.get('value')
  if ($value.isStringLiteral()) return true
  if ($value.isJSXExpressionContainer()) {
    const $expr = $value.get('expression')
    if ($expr.isObjectExpression()) {
      return validateDynamicPartObject($expr)
    } else if ($expr.isArrayExpression()) {
      return validateDynamicPartArray($expr)
    }
  }
  throw $jsxAttribute.buildCodeFrameError(`
    'part' attribute might only be the following:
      - static string
      - array (with static strings or objects)
      - object (with static keys)
    Basically the rule is that the name of the part must be static so that
    it is possible to determine at compile time which parts are being used.
  `)
}

function validateDynamicPartObject ($object) {
  for (const $property of $object.get('properties')) {
    if (!$property.isObjectProperty() || $property.node.computed) {
      throw $property.buildCodeFrameError(`
        'part' attribute only supports literal or string keys in object.
        Dynamic keys or spreads are not supported.
      `)
    }
  }
  return true
}

function validateDynamicPartArray ($array) {
  for (const $element of $array.get('elements')) {
    if ($element.isStringLiteral()) continue
    if ($element.isObjectExpression()) {
      validateDynamicPartObject($element)
      continue
    }
    throw $element.buildCodeFrameError(`
      'part' attribute only supports static strings or objects inside an array.
    `)
  }
  return true
}

function getParts ($value) {
  if ($value.isStringLiteral()) {
    return $value.node.value.split(' ').filter(Boolean).map(i => ({ name: i }))
  } else if ($value.isJSXExpressionContainer()) {
    return getParts($value.get('expression'))
  } else if ($value.isArrayExpression()) {
    return $value.get('elements').map($el => getParts($el)).flat()
  } else if ($value.isObjectExpression()) {
    return $value.get('properties').map($prop => ({
      name: $prop.node.key.name || $prop.node.key.value,
      condition: $prop.node.value
    }))
  }
}

function buildDynamicPart (expr, part) {
  if (part.condition) {
    return t.conditionalExpression(
      part.condition,
      expr,
      t.identifier('undefined')
    )
  } else {
    return expr
  }
}

function checkObserverImport ($import, {
  observerLibrary = GLOBAL_OBSERVER_LIBRARY,
  observerDefaultName = GLOBAL_OBSERVER_DEFAULT_NAME
} = {}) {
  if ($import.node.source.value !== observerLibrary) return
  for (const $specifier of $import.get('specifiers')) {
    if (!$specifier.isImportSpecifier()) continue
    const { imported } = $specifier.node
    if (imported.name === observerDefaultName) return true
  }
}

// find topmost function (which is not a lowercase named one).
// .getFunctionParent() returns undefined when we reach Program
function findReactFnComponent ($jsxAttribute) {
  let $current = $jsxAttribute.getFunctionParent()
  let $potentialComponentFn

  while ($current) {
    // if function is named and starts with a capital letter then it's definitely a component
    // and we return it right away
    if ($current.node.id?.name && /^[A-Z]/.test($current.node.id.name)) return $current
    // set function as component candidate,
    // BUT ignore it if it's named function which starts from a lowercase or underscore,
    // because such function can never be a react component
    if (!($current.node.id?.name && /^[a-z_]/.test($current.node.id.name))) {
      $potentialComponentFn = $current
    }
    // and get the parent function definition
    $current = $current.getFunctionParent()
  }
  return $potentialComponentFn
}

// Get compilers from the magic import
function getUsedCompilers ($program) {
  for (const $import of $program.get('body')) {
    if (!$import.isImportDeclaration()) continue
    if ($import.get('source').node.value !== GLOBAL_OBSERVER_LIBRARY) continue
    const usedCompilers = {}
    for (const $specifier of $import.get('specifiers')) {
      if (!$specifier.isImportSpecifier()) continue
      const importedName = $specifier.get('imported').node.name
      if (COMPILERS.includes(importedName)) {
        const localName = $specifier.get('local').node.name
        usedCompilers[localName] = true
      }
    }
    return usedCompilers
  }
}
