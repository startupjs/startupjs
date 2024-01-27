import { createElement as el } from 'react'
import { ROOT_MODULE as MODULE } from '@startupjs/registry'

export default MODULE.dynamicPlugins(function StartupjsProvider ({ children }) {
  return el(MODULE.RenderNestedHook, { name: 'renderRoot' }, children)
})
