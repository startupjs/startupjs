import { useCallback } from 'react'
import singletonVariables, { defaultVariables } from '@startupjs/babel-plugin-rn-stylename-to-style/variables'

export default function useColors () {
  return useCallback(getColor, [])
}

export function getColor (color, { prefix = '--color', convertToString = true } = {}) {
  if (!color) return

  const cssVar = `${prefix}-${color}`
  const colorInstance = singletonVariables[cssVar] || defaultVariables[cssVar]
  if (!colorInstance) return

  return convertToString ? colorInstance.toString() : colorInstance
}
