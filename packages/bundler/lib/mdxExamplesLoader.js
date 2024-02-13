const path = require('path')
const REGEX = /(```jsx +(?:example|pure-example)[\s\S]*?\n)([\s\S]*?)(```)/g

const FLAGS = [
  'example',
  'noscroll',
  'nostyle',
  'pure-example'
]

const DEFAULT_MDX_RENDERER = `
import React from 'react'
import { observer as __observer } from 'startupjs'
`

module.exports = function mdxExamplesLoader (source) {
  return path.extname(this.resourcePath) === '.mdx'
    ? DEFAULT_MDX_RENDERER + '\n' + source.replace(REGEX, replacer)
    : source
}

function replacer (match, p1, p2, p3) {
  const parts = p1.trim().split(' ')
  const p1Parts = []
  const flags = {}

  for (const part of parts) {
    if (FLAGS.includes(part)) {
      flags[part] = true
      continue
    }
    p1Parts.push(part)
  }

  p1 = p1Parts.join(' ')

  const code = flags['pure-example']
    ? ''
    : `\n\n${p1}\n[HACK EXAMPLE CODE]${p2}${p3}`

  p2 = p2.trim().replace(/\n+/g, '\n')
  if (/^</.test(p2)) p2 = 'return (<React.Fragment>' + p2 + '</React.Fragment>)'

  return (
    `{React.createElement(
        _components.section,
        ${JSON.stringify(flags)},
        <React.Fragment>
          {React.createElement(__observer(function Example () {
            ${p2}
          }))}
        </React.Fragment>
      )}` + code
  )
}
