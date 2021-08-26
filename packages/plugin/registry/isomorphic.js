import Registry from './Registry'

const registry = new Registry({ env: 'isomorphic' })
export default registry
export const getModule = moduleName => registry.getModule(moduleName)
