import { createElement as el } from 'react'
import { ROOT_MODULE as MODULE } from '@startupjs/registry'
import CssMediaUpdater from './CssMediaUpdater'

export default MODULE.dynamicPlugins(function StartupjsProvider ({ children }) {
  return el(MODULE.RenderNestedHook, { name: 'renderRoot' },
    el(CssMediaUpdater, null),
    children
  )
})
