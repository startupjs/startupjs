import Registry from './lib/Registry.js'

const registry = new Registry()

export default registry
export const getModule = moduleName => registry.getModule(moduleName)

// This runs basic metadata validation for the plugin
// but it's mostly used as a marker to trigger the babel-plugin-eliminator
// which will keep only the code relevant for a specific env (client/server/isomorphic/build)
export const createPlugin = (props) => {
  if (!props.name) throw Error('[@startupjs/registry] Plugin "name" is required')
  if (!props.for) throw Error('[@startupjs/registry] Plugin "for" is required (name of the module it extends)')
}
