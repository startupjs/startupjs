import React, { useMemo } from 'react'
import { pug, observer, setDefaultVariables } from 'startupjs'
import ToastProvider from './components/toast/ToastProvider'
import DialogsProvider from './components/dialogs/DialogsProvider'
import Portal from './components/Portal'
import CssVariables from './theming/CssVariables'
import defaultPalette from './theming/defaultPalette'
import defaultVariables from './theming/defaultUiVariables'
import { transformOverrides } from './theming/helpers'
import StyleContext from './StyleContext'

// set default css variables as early as possible
setDefaultVariables(defaultVariables)

export default observer(function UiProvider ({ children, style, palette, colors, componentColors }) {
  const staticOverrides = style?.[':root']

  const cssVariablesMeta = useMemo(() => {
    // dynamic overrides take priority over static
    if (palette || colors || componentColors) return { palette, colors, componentColors }

    if (!staticOverrides) return

    const meta = { palette: {}, colors: {}, componentColors: {} }

    const transformedOverrides = transformOverrides(staticOverrides, defaultPalette.colors, defaultPalette.Color)

    for (const key in transformedOverrides) {
      const isColor = key.includes('--color')
      const isPaletteColor = key.includes('--palette')

      const value = transformedOverrides[key]

      const path = isPaletteColor
        ? 'palette'
        : isColor
          ? 'colors'
          : 'componentColors'

      meta[path][key] = value
    }

    return meta
  }, [JSON.stringify(style?.overrides), JSON.stringify(palette), JSON.stringify(colors), JSON.stringify(componentColors)])

  return pug`
    if cssVariablesMeta
      CssVariables(meta=cssVariablesMeta)

    StyleContext.Provider(value=style)
      Portal.Provider
        ToastProvider
        = children
      DialogsProvider
  `
})
