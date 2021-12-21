const REGEX = /(```jsx +example[\s\S]*?\n)([\s\S]*?)(```)/g
const PURE_REGEX = /(```jsx +pure-example[\s\S]*?\n)([\s\S]*?)(```)/g

const EXAMPLE_FLAGS = [
  'noscroll'
]

module.exports = function mdxExamplesLoader (source) {
  const observer = "import { observer as __observer } from 'startupjs'"
  // NOTE: Two line breaks prevent crashing docs without imports
  // when the text starts from the first line
  return observer + '\n\n' + source.replace(REGEX, replacer).replace(PURE_REGEX, pureReplacer)
}

function replacer (match, p1, p2, p3) {
  const parts = p1.trim().split(' ')
  const sectionParts = []
  const p1Parts = []

  for (const part of parts) {
    if (EXAMPLE_FLAGS.includes(part)) {
      sectionParts.push(part)
      continue
    }
    p1Parts.push(part)
  }

  p1 = p1Parts.join(' ')

  const code = `\n\n${p1}\n${p2}${p3}`

  p2 = p2.trim().replace(/\n+/g, '\n')
  if (/^</.test(p2)) p2 = 'return (<React.Fragment>' + p2 + '</React.Fragment>)'

  return (
    `<section ${sectionParts.join(' ')}>
      <React.Fragment>
        {React.createElement(__observer(function Example () {
          ${p2}
        }))}
      </React.Fragment>
    </section>` + code
  )
}

function pureReplacer (match, p1, p2, p3) {
  const parts = p1.trim().split(' ')
  const sectionParts = []

  for (const part of parts) {
    if (EXAMPLE_FLAGS.includes(part)) {
      sectionParts.push(part)
      continue
    }
  }

  p2 = p2.trim().replace(/\n+/g, '\n')
  if (/^</.test(p2)) p2 = 'return (<React.Fragment>' + p2 + '</React.Fragment>)'

  return (
    `<section ${sectionParts.join(' ')}>
      <React.Fragment>
        {React.createElement(__observer(function Example () {
          ${p2}
        }))}
      </React.Fragment>
    </section>`
  )
}
