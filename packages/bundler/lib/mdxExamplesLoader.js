const REGEX = /(```jsx +example[\s\S]*?\n)([\s\S]*?)(```)/g

const EXAMPLE_FLAGS = [
  'no-scroll',
  'pure'
]

module.exports = function mdxExamplesLoader (source) {
  const observer = "import { observer as __observer } from 'startupjs'"
  // NOTE: Two line breaks prevent crashing docs without imports
  // when the text starts from the first line
  return observer + '\n\n' + source.replace(REGEX, replacer)
}

function replacer (match, p1, p2, p3) {
  const parts = p1.trim().split(' ')
  const sectionParts = []

  for (const part of parts) {
    if (EXAMPLE_FLAGS.includes(part)) {
      sectionParts.push(camelize(part))
      continue
    }
  }

  let jsxCode = p2.trim().replace(/\n+/g, '\n')
  if (/^</.test(jsxCode)) jsxCode = 'return (<React.Fragment>' + jsxCode + '</React.Fragment>)'

  let stringCode = p2.replace(/\n/g, '&#9094')
  stringCode = escapeRegExp(stringCode)

  return (
    `<section ${sectionParts.join(' ')} initCode={\`${stringCode}\`}>
      <React.Fragment>
        {React.createElement(__observer(function Example () {
          ${jsxCode}
        }))}
      </React.Fragment>
    </section>`
  )
}

function escapeRegExp (string) {
  return string.replace(/[.*+?^$`{}()|[\]\\]/g, '\\$&')
}

function camelize (string) {
  return string.replace(/-./g, x => x.toUpperCase()[1])
}
