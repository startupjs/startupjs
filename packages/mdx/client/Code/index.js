import React, { useMemo, memo } from 'react'
import { Span } from '@startupjs/ui'
import refractor from 'refractor/core.js'
// Supported languages
import languageJsx from 'refractor/lang/jsx.js'
import languageStyl from 'refractor/lang/stylus.js'
import languagePug from 'refractor/lang/pug.js'
import languageMarkdown from 'refractor/lang/markdown.js'
import languageJson from 'refractor/lang/json.js'
import './index.styl'

// Register all supported languages
refractor.register(languageJsx)
refractor.register(languageStyl)
refractor.register(languagePug)
refractor.register(languageMarkdown)
refractor.register(languageJson)

// Register aliases
refractor.alias({ stylus: ['styl'] })

export default memo(function Code ({
  children = '',
  language = 'jsx',
  style,
  textStyle,
  ...props
}) {
  if (typeof children !== 'string') throw Error('[Code] Code must be a string')
  const code = useMemo(() => {
    if (!language) return children

    if (language === 'jsx') {
      const pugIndex = children.search(/pug`/gi)

      if (pugIndex !== -1) {
        const jsPart = renderer(refractor.highlight(children.slice(0, pugIndex), language), textStyle)
        const pugPart = renderer(refractor.highlight(children.slice(pugIndex), 'pug'), textStyle)
        return [...jsPart, ...pugPart]
      }
    }

    return renderer(refractor.highlight(children, language), textStyle)
  }, [children, language])

  return pug`
    Span.root(...props style=[textStyle, style])= code
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
