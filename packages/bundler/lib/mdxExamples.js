const REGEX = /(```jsx?) +example([\s\S]*?)(```)/g

module.exports = function mdxExamplesLoader (source) {
  return source.replace(REGEX, '$1$2$3\n$2')
}
