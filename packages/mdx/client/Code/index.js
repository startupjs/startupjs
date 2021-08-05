import React, { useMemo, memo } from 'react'
import { ScrollView } from 'react-native'
import { Span, Div } from '@startupjs/ui'
import refractor from 'refractor/core.js'
// Supported languages
import languageJsx from 'refractor/lang/jsx.js'
import languageStyl from 'refractor/lang/stylus.js'
import languagePug from 'refractor/lang/pug.js'
import languageMarkdown from 'refractor/lang/markdown.js'
import languageJson from 'refractor/lang/json.js'
import './index.styl'

const SUB_LANGUAGE_REGEX = /(^|\W)(pug|styl|css)(`\s*\n)([^`]*\s*\n)(`)/

// Register all supported languages
refractor.register(languageJsx)
refractor.register(languageStyl)
refractor.register(languagePug)
refractor.register(languageMarkdown)
refractor.register(languageJson)

// Register aliases
refractor.alias({ stylus: ['styl'] })

// This method mutates highlighted array to remove the last template
// backtick symbol and also returns it
function modifyAndGetLastBacktick (highlighted) {
  if (!(highlighted && highlighted.length)) return []
  const last = highlighted[highlighted.length - 1]
  if (!last?.properties?.className?.includes('template-string')) {
    throw new Error(`
      [@startupjs/mdx] Last symbol is not a template-string.
      This should never happen.
      Maybe refractor got updated or <Code> component is broken.
    `)
  }
  const lastClone = JSON.parse(JSON.stringify(last))
  last.children.pop()
  lastClone.children.splice(0, lastClone.children.length - 1)
  return lastClone
}

function getLines (code, language) {
  return code.split('\n').reduce((acc, line) => {
    const children = refractor.highlight(line, language)
    const className = ['line']
    const node = {
      type: 'element',
      tagName: 'span',
      properties: { className },
      children
    }

    acc.push(node)
    return acc
  }, []).slice(0, -1)
}

function highlight (code, language) {
  if (!code) return []
  if (language === 'jsx') {
    const match = code.match(SUB_LANGUAGE_REGEX)
    if (match) {
      const splitIndex = match.index + match[0].length
      const start = code.slice(0, splitIndex)
      const rest = code.slice(splitIndex)
      const startJsx = start.replace(SUB_LANGUAGE_REGEX, '$1$2$3$5')
      const startSubLanguage = match[4]
      const subLanguage = match[2]
      const startHighlightedJsx = refractor.highlight(startJsx, 'jsx')
      const closingBacktick = modifyAndGetLastBacktick(startHighlightedJsx)
      return [
        ...startHighlightedJsx, // without trailing ` sign
        ...highlight(startSubLanguage, subLanguage),
        closingBacktick, // the trailing ` sign
        ...highlight(rest, 'jsx')
      ]
    }
  }
  return getLines(code, language)
}

export default memo(function Code ({
  children = '',
  language = 'jsx',
  style,
  textStyle,
  ...props
}) {
  if (typeof children !== 'string') throw Error('[Code] Code must be a string')
  const code = useMemo(() => {
    if (!language) {
      return pug`
        Span= children
      `
    }

    return renderer(highlight(children, language), textStyle)
  }, [children, language])

  return pug`
    ScrollView(
      ...props
      horizontal
      style=[textStyle, style]
    ).scroll
      Div= code
  `
})

function renderer (tree, style) {
  if (!(tree && Array.isArray(tree))) return null
  return tree.map((child, index) => {
    if (child.type === 'text') {
      return child.value
    } else {
      const className = (child.properties && child.properties.className) || []
      return pug`
        Span(key=index style=style styleName=className)= renderer(child.children)
      `
    }
  })
}
