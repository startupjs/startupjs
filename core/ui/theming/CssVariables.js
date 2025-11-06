import { useMemo } from 'react'
import { $, variables as singletonVariables } from 'startupjs'
// TODO: Move CssVariables to basic startupjs and also move the singleton variables file to some generic lib
//       so that it's not tightly coupled with our custom stylesheets implementation
import transformColors from './transformColors'

export default function CssVariables ({ meta, clear = true, children }) {
  function setColorScheme (value = '') {
    document.documentElement.style.colorScheme = value
  }

  useMemo(() => {
    const isWeb = $.system.platform.get() === 'web'
    const isDark = isWeb ? document.documentElement.style.colorScheme === 'dark' : false

    if (!meta) {
      // default color scheme is light so we reset it to default if there are no overrides
      if (isDark) setColorScheme()
      return
    }

    const variables = transformColors(meta)

    // set new variables
    for (const variableName in variables) {
      if (variables[variableName] !== singletonVariables[variableName]) {
        singletonVariables[variableName] = variables[variableName]
      }
    }

    // remove old variables
    for (const variableName in singletonVariables) {
      if (variables[variableName] == null) {
        delete singletonVariables[variableName]
      }
    }

    if (isWeb) {
      if (singletonVariables['--color-bg-main']?.isDark?.()) {
        if (!isDark) setColorScheme('dark')
      } else {
        setColorScheme()
      }
    }

    // clear dynamic theme when destroyed
    if (clear) {
      return () => {
        if (isWeb) setColorScheme()

        for (const variableName in singletonVariables) {
          delete singletonVariables[variableName]
        }
      }
    }
  }, [JSON.stringify(meta)])

  return children || null
}
