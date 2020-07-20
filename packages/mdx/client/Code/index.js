import React, { useMemo, memo } from 'react'
import { Span } from '@startupjs/ui'
import refractor from 'refractor/core.js'
// Supported languages
import languageJsx from 'refractor/lang/jsx.js'
import languageStyl from 'refractor/lang/stylus.js'
import languagePug from 'refractor/lang/pug.js'
import './index.styl'

// Register all supported languages
refractor.register(languageJsx)
refractor.register(languageStyl)
refractor.register(languagePug)

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
    return renderer(refractor.highlight(children, language), textStyle)
  }, [children])
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
