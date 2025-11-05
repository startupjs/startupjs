import { variables as singletonVariables, defaultVariables } from 'startupjs'

export default function getCssVariable (cssVarName, { convertToString = true } = {}) {
  if (!/^--/.test(cssVarName)) throw Error('[getCssVariable]: Incorrect name format - must begin with --')

  const colorInstance = singletonVariables[cssVarName] || defaultVariables[cssVarName]
  if (!colorInstance) return

  return convertToString ? colorInstance.toString() : colorInstance
}
