const REGEX = /(```jsx) +example([\s\S]*?)(```)/g

module.exports = function mdxExamplesLoader (source) {
  return source.replace(REGEX, replacer)
}

function replacer (match, p1, p2, p3) {
  const code = `${p1}${p2}${p3}\n`
  p2 = p2.trim()
  if (/^</.test(p2)) p2 = 'return (<React.Fragment>' + p2 + '</React.Fragment>)'

  return (
    code + `<example>
      <React.Fragment>
        {React.createElement(require('startupjs').observer(function Example () {
          ${p2}
        }))}
      </React.Fragment>
    </example>`
  )
}
