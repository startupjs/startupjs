const yaml = require('js-yaml')

module.exports = function mdxExamplesLoader (source) {
  const yamlData = yaml.load(source)
  return `export default ${JSON.stringify(yamlData)};`
}
