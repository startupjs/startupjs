export const ROOT_MODULE_NAME = 'startupjs'

// helpers to pass props through globalThis into imported module.
// This is helpful to reuse the same code for both server and client
// while having some functionality that is only available in a specific environment.
const IMPORT_PROPS = Symbol('import props')
export const passImportProps = (props = {}) => (globalThis[IMPORT_PROPS] = props)
export const getImportProps = () => {
  const props = globalThis[IMPORT_PROPS] || {}
  delete globalThis[IMPORT_PROPS]
  return props
}
