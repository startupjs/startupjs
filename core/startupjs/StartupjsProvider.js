import { createElement as el } from 'react'
import { ROOT_MODULE as MODULE } from '@startupjs/registry'
import { CssxProvider } from 'cssxjs'

export default MODULE.dynamicPlugins(function StartupjsProvider ({
  children,
  style,
  ...props
}) {
  return el(
    CssxProvider,
    { style },
    el(MODULE.RenderNestedHook, { name: 'renderRoot', style, ...props }, children)
  )
})
