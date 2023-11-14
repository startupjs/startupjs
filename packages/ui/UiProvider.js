import React, { useMemo } from 'react'
import { pug, observer } from 'startupjs'
import { setDefaultVariables } from '@startupjs/babel-plugin-rn-stylename-to-style/variables'
import { ToastProvider } from './components/toast'
import { DialogsProvider } from './components/dialogs'
import CssVariables from './components/CssVariables'
import defaultPalette from './components/CssVariables/defaultPalette'
import { transformOverrides } from './components/CssVariables/helpers'
import Portal from './components/Portal'
import StyleContext from './StyleContext'
import defaultVariables from './components/CssVariables/defaultUiVariables'

// set default css variables as early as possible
setDefaultVariables(defaultVariables)

export default observer(function UiProvider ({ children, style, palette, colors }) {
  const staticOverrides = style?.[':root']

  const cssVariablesMeta = useMemo(() => {
    // dynamic overrides take priority over static
    if (palette || colors) return { palette, colors }

    if (!staticOverrides) return

    const meta = { palette: {}, colors: {} }

    let transformedOverrides = transformOverrides(staticOverrides, defaultPalette.colors, defaultPalette.Color)

    for (const key in transformedOverrides) {
      const isColor = key.includes('--color')
      const isPaletteColor = key.includes('--palette')

      if (!isColor && !isPaletteColor) {
        console.error("[UiProvider]: incorrect key format in 'style' object - must begin --color or --palette")
        continue
      }

      const value = transformedOverrides[key]

      try {
        const path = isPaletteColor
          ? 'palette'
          : 'colors'
        meta[path][key] = value
      } catch (err) {}
    }

    return meta
  }, [JSON.stringify(style?.overrides), JSON.stringify(palette), JSON.stringify(colors)])

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
