import { useCallback } from 'react'
import singletonVariables, { defaultVariables } from '@startupjs/babel-plugin-rn-stylename-to-style/variables'

export default function useColors () {
  return useCallback(getColor, [])
}

export function getColor (color, { addPrefix = true, prefix = '--color', convertToString = true } = {}) {
  if (!color) return
  const cssVar = addPrefix ? `${prefix}-${color}` : color
  // '?' operator is needed for cases in button and tag components to get 'text-on-' color
  // maybe get rid of it here and wrap function calls there in try/catch
  const colorValue = singletonVariables[cssVar] || defaultVariables[cssVar]
  if (!colorValue) return

  return convertToString ? colorValue.toString() : colorValue
}
