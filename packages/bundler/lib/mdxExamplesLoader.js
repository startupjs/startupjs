const REGEX = /(```jsx) +example([\s\S]*?)(```)/g
const PURE_REGEX = /(```jsx) +pure-example([\s\S]*?)(```)/g

module.exports = function mdxExamplesLoader (source) {
  const observer = "import { observer as __observer } from 'startupjs'"
  // NOTE: Two line breaks prevent crashing docs without imports
  // when the text starts from the first line
  return observer + '\n\n' + source.replace(REGEX, replacer).replace(PURE_REGEX, pureReplacer)
}

function replacer (match, p1, p2, p3) {
  const code = `\n\n${p1}${p2}${p3}\n`
  p2 = p2.trim().replace(/\n+/g, '\n')
  if (/^</.test(p2)) p2 = 'return (<React.Fragment>' + p2 + '</React.Fragment>)'

  return (
    `<section>
      <React.Fragment>
        {React.createElement(__observer(function Example () {
          ${p2}
        }))}
      </React.Fragment>
    </section>` + code
  )
}

function pureReplacer (match, p1, p2, p3) {
  p2 = p2.trim().replace(/\n+/g, '\n')
  if (/^</.test(p2)) p2 = 'return (<React.Fragment>' + p2 + '</React.Fragment>)'

  return (
    `<section>
      <React.Fragment>
        {React.createElement(__observer(function Example () {
          ${p2}
        }))}
      </React.Fragment>
    </section>`
  )
}
