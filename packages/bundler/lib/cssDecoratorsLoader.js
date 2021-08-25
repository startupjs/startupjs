const css2rn = require('@startupjs/css-to-react-native-transform').default
const { parse } = require('@babel/parser')
const traverse = require('@babel/traverse').default
const template = require('@babel/template').default
const generate = require('@babel/generator').default
const types = require('@babel/types')
const fs = require('fs')
const path = require('path')
const stylus = require('stylus')

const STYLES_PATH = path.join(process.cwd(), 'styles/index.styl')

module.exports = function replaceObserverLoader (source) {
  const jsFilePath = this.resourcePath.split('/').slice(0, -1).join('/')

  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['jsx']
  })

  let cssObject = {}
  traverse(ast, {
    ImportDeclaration (pathNode) {
      if (pathNode.node.source.value.search(/\.styl/gi) !== -1) {
        const pathStyle = path.join(jsFilePath, pathNode.node.source.value)
        const sourceStyle = fs.readFileSync(pathStyle, 'utf8')

        if (sourceStyle.indexOf(':hover') !== -1) {
          const compiler = stylus(sourceStyle)
          compiler.set('filename', pathStyle)
          if (fs.existsSync(STYLES_PATH)) {
            compiler.import(STYLES_PATH)
          }

          let css = ''
          compiler.render(function (err, res) {
            if (err) throw new Error(err)
            css = res
          })

          var tempArr
          /* eslint-disable-next-line */
          var findClassHover = /\.(\w+)\:hover(| )({[\w\s-:#;]+})/gi
          while ((tempArr = findClassHover.exec(css)) !== null) {
            const [, className, , style] = tempArr

            cssObject = {
              ...cssObject,
              ...css2rn(`.${className} ${style}`)
            }
          }
        }
      }
    }
  })

  let rootPath
  let countHover = 0
  traverse(ast, {
    Program (path) {
      rootPath = path
    },
    CallExpression (nodePath) {
      if (Object.keys(cssObject).length && nodePath.node.callee &&
        nodePath.node.callee.name === '_processStyleName') {
        let isFind = false
        let styleName = ''
        if (nodePath.node.arguments[0].type === 'StringLiteral') {
          styleName = nodePath.node.arguments[0].value
          isFind = !!cssObject[styleName]
        } else if (nodePath.node.arguments[0].type === 'ArrayExpression') {
          isFind = nodePath.node.arguments[0].elements.find(node => {
            styleName = node.value || node.name
            return node.value && !!cssObject[styleName]
          })
        }

        if (isFind) {
          if (countHover === 0) {
            const importDeclaration = template('import { useHover } from \'@startupjs/ui/hooks\'')()
            rootPath.unshiftContainer('body', importDeclaration)
          }

          const hookPropsName = `hoverProps${countHover}`
          const hookStyleName = `hoverStyle${countHover}`
          const hookDeclaration = template(`const [${hookPropsName}, ${hookStyleName}] = useHover(${
            JSON.stringify(cssObject[styleName])
          })`)()

          const componentPath = getComponentPath(nodePath.parentPath)
          const jsxDeclaration = componentPath.node.body[componentPath.node.body.length - 1]
          componentPath.node.body[componentPath.node.body.length - 1] = hookDeclaration
          componentPath.node.body.push(jsxDeclaration)

          if (nodePath.parentPath.node.callee.name === '_extends') {
            nodePath.parentPath.node.arguments.forEach(node => {
              if (node.type === 'ObjectExpression') {
                node.properties.push(types.spreadElement(types.identifier(hookPropsName)))
              }
            })
          } else {
            nodePath.parentPath.node.arguments[1] = types.callExpression(
              types.identifier('_extends'),
              [
                types.objectExpression([
                  types.spreadElement(types.identifier(hookPropsName))
                ]),
                nodePath.node
              ]
            )
          }

          const lastArgument = nodePath.node.arguments[nodePath.node.arguments.length - 1]
          const findStyleIndex = lastArgument.properties.findIndex(node => {
            return node.key && node.key.name === 'style'
          })
          if (findStyleIndex !== -1) {
            lastArgument.properties[0].value.properties.push(
              types.spreadElement(types.identifier(hookStyleName))
            )
          } else {
            lastArgument.properties.push(
              types.objectProperty(
                types.identifier('style'),
                types.objectExpression([
                  types.spreadElement(types.identifier(hookStyleName))
                ])
              )
            )
          }

          countHover++
        }
      }
    }
  })

  if (Object.keys(cssObject).length) {
    const newCode = generate(ast).code
    return newCode
  }

  return source
}

function getComponentPath (curPath) {
  if (curPath.type === 'ReturnStatement') {
    return curPath.parentPath
  } else {
    return getComponentPath(curPath.parentPath)
  }
}
