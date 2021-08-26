import Registry from './Registry'

const registry = new Registry({ env: 'client' })
export default registry
export const getModule = moduleName => registry.getModule(moduleName)
