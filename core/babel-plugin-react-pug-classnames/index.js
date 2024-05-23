function isTargetAttr (attribute, classAttribute) {
  if (!classAttribute) classAttribute = 'className'
  return attribute.name.name === classAttribute
}

function isGoodNameForNestedComponent (name) {
  return /^[A-Z0-9_$]/.test(name)
}

module.exports = (babel) => {
  const t = babel.types

  function processClass (JSXOpeningElement, opts) {
    const name = JSXOpeningElement.node.name.name
    let property = null

    JSXOpeningElement.traverse({
      JSXAttribute (JSXAttribute) {
        let expr
        let classesValue
        let classes

        if (!isTargetAttr(JSXAttribute.node, opts.classAttribute)) return

        if (t.isStringLiteral(JSXAttribute.node.value)) {
          classesValue = JSXAttribute.node.value.value.trim()
          classes = classesValue.split(' ')
          if (!isGoodNameForNestedComponent(classes[0])) return

          property = classes[0]

          if (classes.length > 1) {
            // Get rid of the class which is actually a tag property
            classes = classes.slice(1)

            JSXAttribute.get('value').replaceWith(t.stringLiteral(classes.join(' ')))
          } else {
            JSXAttribute.remove()
          }
        } else if (t.isJSXExpressionContainer(JSXAttribute.node.value)) {
          expr = JSXAttribute.node.value.expression

          if (t.isBinaryExpression(expr)) {
            if (expr.operator !== '+') return
            if (!t.isStringLiteral(expr.left)) return

            classesValue = expr.left.value.trim()
            classes = classesValue.split(' ')

            if (isGoodNameForNestedComponent(classes[0])) {
              property = classes[0]

              // Get rid of the class which is actually a tag property
              classes = classes.slice(1)
            }

            // Handle the pug usecase to support object and array shorthands
            // when the shorthand class is used together with a styleName expression.
            // Pug compiles
            //   Div.hello(styleName=expr)
            // into:
            //   <Div styleName={ 'hello ' + expr } />
            JSXAttribute.node.value.expression = t.arrayExpression([
              ...classes.map(c => t.stringLiteral(c)),
              expr.right
            ])
          } else if (t.isArrayExpression(expr)) {
            if (!t.isStringLiteral(expr.elements[0])) return

            classesValue = expr.elements[0].value.trim()
            classes = classesValue.split(' ')
            if (!isGoodNameForNestedComponent(classes[0])) return

            property = classes[0]

            // Get rid of the class which is actually a tag property
            classes = classes.slice(1)

            if (classes.length > 0) {
              expr.elements[0] = classes.join(' ')
            } else {
              expr.elements = expr.elements.slice(1)
            }
          }
        }
      }
    })

    if (property) {
      const tag = t.jSXMemberExpression(t.jSXIdentifier(name), t.jSXIdentifier(property))

      JSXOpeningElement.get('name').replaceWith(tag)

      if (!JSXOpeningElement.node.selfClosing) {
        JSXOpeningElement.getSibling('closingElement').get('name').replaceWith(tag)
      }
    }
  }

  return {
    visitor: {
      JSXElement (JSXElement, params) {
        JSXElement.traverse({
          JSXOpeningElement (JSXOpeningElement) {
            processClass(JSXOpeningElement, params.opts)
          }
        })
      }
    }
  }
}
