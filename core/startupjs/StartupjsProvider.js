import { createElement as el } from 'react'
import { ROOT_MODULE as MODULE } from '@startupjs/registry'
import { CssxProvider } from 'cssxjs'

export default MODULE.dynamicPlugins(function StartupjsProvider ({
  children,
  style,
  theme,
  ...props
}) {
  return el(
    CssxProvider,
    { style, theme },
    el(MODULE.RenderNestedHook, { name: 'renderRoot', style, theme, ...props }, children)
  )
})
