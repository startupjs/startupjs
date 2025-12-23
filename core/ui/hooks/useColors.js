import { useCallback } from 'react'
import { variables as singletonVariables, defaultVariables } from 'startupjs'

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
