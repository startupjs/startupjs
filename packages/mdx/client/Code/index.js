import React, { useMemo, memo } from 'react'
import { Div, Span, ScrollView } from '@startupjs/ui'
import refractor from 'refractor/core.js'
// Supported languages
import languageJsx from 'refractor/lang/jsx.js'
import languageStyl from 'refractor/lang/stylus.js'
import languagePug from 'refractor/lang/pug.js'
import languageMarkdown from 'refractor/lang/markdown.js'
import languageJson from 'refractor/lang/json.js'
import languageBash from 'refractor/lang/bash.js'
import './index.styl'

const SUB_LANGUAGE_REGEX = /(^|\W)(pug|styl|css)(`\s*\n)([^`]*\s*\n)(`)/

// Register all supported languages
refractor.register(languageJsx)
refractor.register(languageStyl)
refractor.register(languagePug)
refractor.register(languageMarkdown)
refractor.register(languageJson)
refractor.register(languageBash)

// Register aliases
refractor.alias({ stylus: ['styl'] })
refractor.alias({ bash: ['sh'] })

// This method mutates highlighted array to remove the last template
// backtick symbol and also returns it
function modifyAndGetLastBacktick (highlighted) {
  if (!(highlighted && highlighted.length)) return []
  const lastLine = highlighted[highlighted.length - 1]
  const lastSymbol = lastLine.children[lastLine.children.length - 1]

  // check close backtick
  if (lastSymbol?.value !== '`') {
    throw new Error(`
      [@startupjs/mdx] Last symbol is not a backtick.
      This should never happen.
      Maybe refractor got updated or <Code> component is broken.
    `)
  }

  // remove last line with backtick
  highlighted.pop()

  return {
    type: 'element',
    tagName: 'span',
    properties: { className: ['line'] },
    children: [{ type: 'text', value: '`' }]
  }
}

function getLines (code, language) {
  const lines = code.split('\n')
  if (lines[lines.length - 1] === '') lines.pop()

  return lines.reduce((acc, line) => {
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
  }, [])
}

function highlight (code, language) {
  if (language === 'jsx') {
    const match = code.match(SUB_LANGUAGE_REGEX)
    if (match) {
      const splitIndex = match.index + match[0].length
      const start = code.slice(0, splitIndex)
      const next = code.slice(splitIndex + 1)

      const jsx = start.replace(SUB_LANGUAGE_REGEX, '$1$2$3$5')
      const highlightedJsx = getLines(jsx, 'jsx')

      const subLanguageName = match[2]
      const bodySubLanguage = match[4]
      const closingBacktick = modifyAndGetLastBacktick(highlightedJsx)

      const merge = [
        ...highlightedJsx, // without trailing ` sign
        ...highlight(bodySubLanguage, subLanguageName),
        closingBacktick // the trailing ` sign
      ]

      if (next) merge.push(...highlight(next, 'jsx'))
      return merge
    }
  }
  return getLines(code, language)
}

export default memo(function Code ({
  children = '',
  language = 'txt',
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
    ScrollView.root(
      ...props
      horizontal
      style=style
    )
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
